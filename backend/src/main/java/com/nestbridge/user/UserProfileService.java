package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    static final int MIN_BIO_LENGTH = 12;
    static final int MIN_ABOUT_LENGTH = 40;

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProviderSetupRepository providerSetupRepository;

    @Transactional(readOnly = true)
    public AccountProfileDto getMyProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        SeekerProfile seeker = seekerProfileRepository.findById(userId)
                .orElseGet(() -> defaultSeeker(userId));
        ProviderSetup host = providerSetupRepository.findByUserIdAndTrack(userId, "HOST")
                .orElseGet(() -> defaultProvider(userId, "HOST"));
        ProviderSetup guide = providerSetupRepository.findByUserIdAndTrack(userId, "GUIDE")
                .orElseGet(() -> defaultProvider(userId, "GUIDE"));

        return AccountProfileDto.builder()
                .primaryIntent(user.getPrimaryIntent())
                .isActiveExchangeStudent(user.isActiveExchangeStudent())
                .seekerSetup(toDto(seeker.getStatus(), seeker.getStepsCompleted(), seeker.getProfileData()))
                .hostProvider(toDto(host.getStatus(), host.getStepsCompleted(), host.getProfileData()))
                .guideProvider(toDto(guide.getStatus(), guide.getStepsCompleted(), guide.getProfileData()))
                .build();
    }

    @Transactional
    public AccountProfileDto updateMyProfile(UUID userId, AccountProfileUpdateDto update) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (update.getPrimaryIntent() != null) {
            user.setPrimaryIntent(update.getPrimaryIntent());
        }
        if (update.getIsActiveExchangeStudent() != null) {
            user.setActiveExchangeStudent(update.getIsActiveExchangeStudent());
        }
        if (update.getSeekerSetup() != null && update.getSeekerSetup().getData() != null) {
            applyIdentityFields(user, update.getSeekerSetup().getData());
        } else if (update.getHostProvider() != null && update.getHostProvider().getData() != null) {
            applyIdentityFields(user, update.getHostProvider().getData());
        } else if (update.getGuideProvider() != null && update.getGuideProvider().getData() != null) {
            applyIdentityFields(user, update.getGuideProvider().getData());
        }
        userRepository.save(user);

        if (update.getSeekerSetup() != null) {
            applyTrackUpdate(userId, "SEEKER", update.getSeekerSetup());
        }
        if (update.getHostProvider() != null) {
            applyProviderTrackIfAllowed(user, userId, "HOST", update.getHostProvider());
        }
        if (update.getGuideProvider() != null) {
            applyProviderTrackIfAllowed(user, userId, "GUIDE", update.getGuideProvider());
        }

        return getMyProfile(userId);
    }

    /**
     * Bio + about are the public identity other users book against.
     * Once locked (or already non-blank on the user), they cannot be changed.
     */
    private void applyIdentityFields(User user, Map<String, Object> data) {
        String incomingBio = stringValue(data.get("bio"));
        String incomingAbout = stringValue(data.get("about"));
        String incomingName = stringValue(data.get("displayName"));
        String incomingPhoto = stringValue(data.get("profilePhotoUrl"));

        if (user.isIdentityLocked()) {
            if (incomingBio != null && !incomingBio.equals(nullToEmpty(user.getBio()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Your short bio is locked. Contact support if it must be corrected.");
            }
            if (incomingAbout != null && !incomingAbout.equals(nullToEmpty(user.getAbout()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Your about section is locked. Contact support if it must be corrected.");
            }
            if (incomingName != null && !incomingName.isBlank()
                    && !incomingName.equals(nullToEmpty(user.getFullName()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Your display name is locked with your bio and about.");
            }
            // Preserve locked values in the payload for track merge.
            data.put("bio", user.getBio());
            data.put("about", user.getAbout());
            data.put("displayName", user.getFullName());
            data.put("identityLocked", true);
        } else {
            if (incomingBio != null && !incomingBio.isBlank()) {
                if (incomingBio.trim().length() < MIN_BIO_LENGTH) {
                    throw new IllegalArgumentException(
                            "Short bio must be at least " + MIN_BIO_LENGTH + " characters.");
                }
                user.setBio(incomingBio.trim());
            }
            if (incomingAbout != null && !incomingAbout.isBlank()) {
                if (incomingAbout.trim().length() < MIN_ABOUT_LENGTH) {
                    throw new IllegalArgumentException(
                            "About section must be at least " + MIN_ABOUT_LENGTH + " characters.");
                }
                user.setAbout(incomingAbout.trim());
            }
            if (incomingName != null && !incomingName.isBlank()) {
                user.setFullName(incomingName.trim());
            }
            boolean readyToLock = hasIdentity(user);
            if (readyToLock) {
                user.setIdentityLocked(true);
                data.put("identityLocked", true);
                data.put("bio", user.getBio());
                data.put("about", user.getAbout());
            }
        }

        if (incomingPhoto != null && !incomingPhoto.isBlank()) {
            user.setProfilePhotoUrl(incomingPhoto);
        }
    }

    public static boolean hasIdentity(User user) {
        return user.getBio() != null && user.getBio().trim().length() >= MIN_BIO_LENGTH
                && user.getAbout() != null && user.getAbout().trim().length() >= MIN_ABOUT_LENGTH;
    }

    public static boolean hasIdentityInData(Map<String, Object> data) {
        if (data == null) {
            return false;
        }
        String bio = stringValue(data.get("bio"));
        String about = stringValue(data.get("about"));
        return bio != null && bio.trim().length() >= MIN_BIO_LENGTH
                && about != null && about.trim().length() >= MIN_ABOUT_LENGTH;
    }

    private static String stringValue(Object value) {
        return value instanceof String s ? s : null;
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    /**
     * Active exchange students cannot enable host/guide listing. Idle
     * NOT_STARTED payloads (sent when the mobile app syncs the full profile)
     * must be ignored — not rejected — so seeker onboarding still persists.
     */
    private void applyProviderTrackIfAllowed(
            User user,
            UUID userId,
            String track,
            ProfileProgressDto dto
    ) {
        boolean activeExchangeStudent =
                user.getPrimaryIntent() == PrimaryIntent.STUDENT && user.isActiveExchangeStudent();
        if (activeExchangeStudent) {
            if (isProviderEnableAttempt(dto)) {
                throw new IllegalArgumentException(
                        "Active exchange students cannot enable "
                                + ("HOST".equals(track) ? "host" : "guide")
                                + " listing until exchange ends.");
            }
            return;
        }
        applyTrackUpdate(userId, track, dto);
    }

    private boolean isProviderEnableAttempt(ProfileProgressDto dto) {
        if (dto == null) {
            return false;
        }
        if (dto.getStatus() == ProfileStatus.IN_PROGRESS || dto.getStatus() == ProfileStatus.COMPLETE) {
            return true;
        }
        List<String> steps = dto.getStepsCompleted();
        return steps != null && !steps.isEmpty();
    }

    private void applyTrackUpdate(UUID userId, String track, ProfileProgressDto dto) {
        if ("SEEKER".equals(track)) {
            SeekerProfile profile = seekerProfileRepository.findById(userId)
                    .orElseGet(() -> defaultSeekerEntity(userId));
            mergeProgress(profile, dto);
            seekerProfileRepository.save(profile);
            return;
        }
        ProviderSetup profile = providerSetupRepository.findByUserIdAndTrack(userId, track)
                .orElseGet(() -> defaultProviderEntity(userId, track));
        mergeProviderProgress(profile, dto);
        providerSetupRepository.save(profile);
    }

    private void mergeProgress(SeekerProfile profile, ProfileProgressDto dto) {
        Map<String, Object> mergedData = mergeDataPreservingLockedIdentity(profile.getProfileData(), dto.getData());
        if (dto.getStatus() == ProfileStatus.COMPLETE && !hasIdentityInData(mergedData)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Add and lock your short bio and about section before finishing your travel profile.");
        }
        if (dto.getStatus() != null) {
            profile.setStatus(dto.getStatus());
            if (dto.getStatus() == ProfileStatus.COMPLETE) {
                profile.setCompletedAt(LocalDateTime.now());
            }
        }
        if (dto.getStepsCompleted() != null) {
            profile.setStepsCompleted(new ArrayList<>(dto.getStepsCompleted()));
        }
        if (mergedData != null) {
            profile.setProfileData(mergedData);
        }
    }

    private void mergeProviderProgress(ProviderSetup profile, ProfileProgressDto dto) {
        Map<String, Object> mergedData = mergeDataPreservingLockedIdentity(profile.getProfileData(), dto.getData());
        if (dto.getStatus() == ProfileStatus.COMPLETE && !hasIdentityInData(mergedData)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Add and lock your short bio and about section before publishing your listing.");
        }
        if (dto.getStatus() != null) {
            profile.setStatus(dto.getStatus());
            if (dto.getStatus() == ProfileStatus.COMPLETE) {
                profile.setCompletedAt(LocalDateTime.now());
            }
        }
        if (dto.getStepsCompleted() != null) {
            profile.setStepsCompleted(new ArrayList<>(dto.getStepsCompleted()));
        }
        if (mergedData != null) {
            profile.setProfileData(mergedData);
        }
    }

    private Map<String, Object> mergeDataPreservingLockedIdentity(
            Map<String, Object> existing,
            Map<String, Object> incoming
    ) {
        Map<String, Object> merged = new HashMap<>(existing != null ? existing : Map.of());
        boolean locked = Boolean.TRUE.equals(merged.get("identityLocked"))
                || (merged.get("identityLocked") instanceof String s && "true".equalsIgnoreCase(s));
        if (incoming == null) {
            return merged;
        }
        if (locked) {
            Object lockedBio = merged.get("bio");
            Object lockedAbout = merged.get("about");
            Object lockedName = merged.get("displayName");
            merged.putAll(incoming);
            merged.put("bio", lockedBio);
            merged.put("about", lockedAbout);
            merged.put("displayName", lockedName);
            merged.put("identityLocked", true);
            return merged;
        }
        merged.putAll(incoming);
        if (hasIdentityInData(merged)) {
            merged.put("identityLocked", true);
        }
        return merged;
    }

    private ProfileProgressDto toDto(ProfileStatus status, List<String> steps, Map<String, Object> data) {
        return ProfileProgressDto.builder()
                .status(status != null ? status : ProfileStatus.NOT_STARTED)
                .stepsCompleted(steps != null ? steps : List.of())
                .data(data != null ? data : Map.of())
                .build();
    }

    private SeekerProfile defaultSeeker(UUID userId) {
        return defaultSeekerEntity(userId);
    }

    private SeekerProfile defaultSeekerEntity(UUID userId) {
        return SeekerProfile.builder()
                .userId(userId)
                .status(ProfileStatus.NOT_STARTED)
                .stepsCompleted(new ArrayList<>())
                .profileData(new HashMap<>())
                .build();
    }

    private ProviderSetup defaultProvider(UUID userId, String track) {
        return defaultProviderEntity(userId, track);
    }

    private ProviderSetup defaultProviderEntity(UUID userId, String track) {
        return ProviderSetup.builder()
                .userId(userId)
                .track(track)
                .status(ProfileStatus.NOT_STARTED)
                .stepsCompleted(new ArrayList<>())
                .profileData(new HashMap<>())
                .build();
    }
}

package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserProfileService {

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
            var bio = update.getSeekerSetup().getData().get("bio");
            if (bio instanceof String s && !s.isBlank()) {
                user.setBio(s);
            }
            var name = update.getSeekerSetup().getData().get("displayName");
            if (name instanceof String s && !s.isBlank()) {
                user.setFullName(s);
            }
            var photo = update.getSeekerSetup().getData().get("profilePhotoUrl");
            if (photo instanceof String s && !s.isBlank()) {
                user.setProfilePhotoUrl(s);
            }
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
        if (dto.getStatus() != null) {
            profile.setStatus(dto.getStatus());
            if (dto.getStatus() == ProfileStatus.COMPLETE) {
                profile.setCompletedAt(LocalDateTime.now());
            }
        }
        if (dto.getStepsCompleted() != null) {
            profile.setStepsCompleted(new ArrayList<>(dto.getStepsCompleted()));
        }
        if (dto.getData() != null) {
            Map<String, Object> merged = new HashMap<>(profile.getProfileData());
            merged.putAll(dto.getData());
            profile.setProfileData(merged);
        }
    }

    private void mergeProviderProgress(ProviderSetup profile, ProfileProgressDto dto) {
        if (dto.getStatus() != null) {
            profile.setStatus(dto.getStatus());
            if (dto.getStatus() == ProfileStatus.COMPLETE) {
                profile.setCompletedAt(LocalDateTime.now());
            }
        }
        if (dto.getStepsCompleted() != null) {
            profile.setStepsCompleted(new ArrayList<>(dto.getStepsCompleted()));
        }
        if (dto.getData() != null) {
            Map<String, Object> merged = new HashMap<>(profile.getProfileData());
            merged.putAll(dto.getData());
            profile.setProfileData(merged);
        }
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

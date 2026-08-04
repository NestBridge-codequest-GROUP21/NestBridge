package com.nestbridge.community;

import com.nestbridge.common.GhanaReference;
import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.user.SeekerProfile;
import com.nestbridge.user.SeekerProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserProfileService;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final SeekerProfileRepository seekerProfileRepository;
    private final HostProfileRepository hostProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public NearbyCommunityDto nearby(UUID requesterId, String cityOverride) {
        String city = resolveCity(requesterId, cityOverride);
        if (city == null || city.isBlank()) {
            return NearbyCommunityDto.builder()
                    .city("")
                    .students(List.of())
                    .hosts(List.of())
                    .build();
        }

        String normalized = GhanaReference.normalizeCity(city);
        List<CommunityMemberDto> students = listStudentsInCity(requesterId, normalized);
        List<CommunityHostDto> hosts = listHostsInCity(normalized);

        return NearbyCommunityDto.builder()
                .city(normalized)
                .students(students)
                .hosts(hosts)
                .build();
    }

    private String resolveCity(UUID requesterId, String cityOverride) {
        if (cityOverride != null && !cityOverride.isBlank()) {
            return cityOverride.trim();
        }
        return seekerProfileRepository.findById(requesterId)
                .map(SeekerProfile::getProfileData)
                .map(data -> stringField(data, "city"))
                .filter(value -> !value.isBlank())
                .orElse("");
    }

    private List<CommunityMemberDto> listStudentsInCity(UUID requesterId, String normalizedCity) {
        List<SeekerProfile> seekers = seekerProfileRepository.findCompleteSeekersByIntent(
                ProfileStatus.COMPLETE, PrimaryIntent.STUDENT);
        List<CommunityMemberDto> result = new ArrayList<>();
        for (SeekerProfile seeker : seekers) {
            User user = seeker.getUser();
            if (user == null || user.getUserId().equals(requesterId)) {
                continue;
            }
            // Discoverable once they have a locked public identity (bio + about).
            if (!UserProfileService.hasIdentity(user)
                    && !UserProfileService.hasIdentityInData(seeker.getProfileData())) {
                continue;
            }
            String seekerCity = GhanaReference.normalizeCity(stringField(seeker.getProfileData(), "city"));
            if (!normalizedCity.equalsIgnoreCase(seekerCity)) {
                continue;
            }
            result.add(toMemberDto(user, seeker.getProfileData()));
        }
        result.sort(Comparator.comparing(CommunityMemberDto::getFullName, String.CASE_INSENSITIVE_ORDER));
        return result.size() > 40 ? result.subList(0, 40) : result;
    }

    private List<CommunityHostDto> listHostsInCity(String normalizedCity) {
        List<HostProfile> hosts = hostProfileRepository.findByCityIgnoreCaseAndActiveTrue(normalizedCity);
        if (hosts.isEmpty()) {
            // Try raw city match aliases already normalized; also scan active hosts for alias cities.
            hosts = hostProfileRepository.findByActiveTrue().stream()
                    .filter(host -> normalizedCity.equalsIgnoreCase(
                            GhanaReference.normalizeCity(host.getCity())))
                    .toList();
        }
        List<CommunityHostDto> result = new ArrayList<>();
        for (HostProfile host : hosts) {
            User user = userRepository.findById(host.getUserId()).orElse(null);
            if (user == null || user.isSuspended()) {
                continue;
            }
            // Marketplace hosts shown in vicinity should be staff-verified.
            if (!user.isIdentityVerified()) {
                continue;
            }
            result.add(toHostDto(host, user));
        }
        result.sort(Comparator.comparing(CommunityHostDto::getFullName, String.CASE_INSENSITIVE_ORDER));
        return result.size() > 40 ? result.subList(0, 40) : result;
    }

    private CommunityMemberDto toMemberDto(User user, Map<String, Object> profileData) {
        String name = user.getFullName() != null ? user.getFullName() : "Student";
        return CommunityMemberDto.builder()
                .userId(user.getUserId().toString())
                .fullName(name)
                .initials(initials(name))
                .bio(firstNonBlank(user.getBio(), stringField(profileData, "bio")))
                .about(firstNonBlank(user.getAbout(), stringField(profileData, "about")))
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .city(GhanaReference.normalizeCity(stringField(profileData, "city")))
                .university(stringField(profileData, "university"))
                .nationality(user.getNationality())
                .identityVerified(user.isIdentityVerified())
                .build();
    }

    private CommunityHostDto toHostDto(HostProfile host, User user) {
        String name = user.getFullName() != null ? user.getFullName() : "Host";
        return CommunityHostDto.builder()
                .hostId(host.getHostId().toString())
                .userId(user.getUserId().toString())
                .fullName(name)
                .initials(initials(name))
                .bio(user.getBio())
                .city(host.getCity())
                .address(host.getAddress())
                .roomType(host.getRoomType())
                .pricePerNight(host.getPricePerNight())
                .averageRating(host.getAverageRating())
                .reviewCount(host.getReviewCount())
                .identityVerified(user.isIdentityVerified())
                .build();
    }

    private static String stringField(Map<String, Object> data, String key) {
        if (data == null) {
            return "";
        }
        Object value = data.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a.trim();
        }
        if (b != null && !b.isBlank()) {
            return b.trim();
        }
        return "";
    }

    private static String initials(String name) {
        if (name == null || name.isBlank()) {
            return "ST";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase(Locale.ROOT);
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase(Locale.ROOT);
    }
}

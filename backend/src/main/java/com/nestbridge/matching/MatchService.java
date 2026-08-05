package com.nestbridge.matching;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nestbridge.auth.TokenBlacklistService;
import com.nestbridge.common.GhanaReference;
import com.nestbridge.common.ProviderVerificationDto;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchingAlgorithm algorithm;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final UserRepository userRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final TokenBlacklistService cacheService;
    private final ObjectMapper objectMapper;

    @Transactional
    public List<MatchResultDto> findMatches(UUID seekerId, MatchFindRequest request) {
        if (request.getCity() != null && !request.getCity().isBlank()) {
            request.setCity(GhanaReference.normalizeCity(request.getCity()));
        }
        String cacheKey = seekerId + ":" + searchHash(request);
        try {
            String cached = cacheService.getCachedMatchResults(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, new TypeReference<>() {});
            }
        } catch (Exception ignored) {
            // proceed without cache
        }

        User seeker = userRepository.findById(seekerId).orElseThrow();
        String targetType = request.getTargetType() != null ? request.getTargetType().toUpperCase() : "HOST";
        List<MatchResultDto> results;

        if ("GUIDE".equals(targetType)) {
            results = findGuideMatches(seeker, request);
        } else {
            results = findHostMatches(seeker, request);
        }

        try {
            cacheService.cacheMatchResults(cacheKey, objectMapper.writeValueAsString(results), Duration.ofMinutes(15));
        } catch (Exception ignored) {
            // cache optional
        }
        return results;
    }

    private List<MatchResultDto> findHostMatches(User seeker, MatchFindRequest request) {
        String city = GhanaReference.normalizeCity(request.getCity());
        List<HostProfile> hosts = request.getCity() != null
                ? hostProfileRepository.findByCityIgnoreCaseAndActiveTrue(city)
                : hostProfileRepository.findByActiveTrue();
        Map<UUID, User> users = loadUsers(hosts.stream().map(HostProfile::getUserId).collect(Collectors.toSet()));
        // Marketplace integrity: only staff-verified hosts are bookable / shown in matches.
        List<HostProfile> verifiedHosts = hosts.stream()
                .filter(h -> {
                    User u = users.get(h.getUserId());
                    return u != null && u.isIdentityVerified();
                })
                .collect(Collectors.toList());
        List<MatchingAlgorithm.ScoredHost> scored = algorithm.scoreHosts(verifiedHosts, users, request, seeker);

        return scored.stream().limit(20).map(s -> {
            HostProfile h = s.host();
            User u = s.hostUser();
            MatchRecord record = persistMatch(seeker.getUserId(), h.getHostId(), "HOST", s.score(), s.breakdown(), s.reasons());
            String name = u != null ? u.getFullName() : "Host";
            String photo = h.getPhotos() != null && !h.getPhotos().isEmpty() ? h.getPhotos().get(0)
                    : (u != null ? u.getProfilePhotoUrl() : null);
            Double dist = distanceKm(h.getLat(), h.getLng(), request.getUniversityLat(), request.getUniversityLng());
            return MatchResultDto.builder()
                    .matchId(record.getMatchId().toString())
                    .targetId(h.getHostId().toString())
                    .targetType("HOST")
                    .targetName(name)
                    .targetPhotoUrl(photo)
                    .compatibilityScore(s.score())
                    .scoreBreakdown(s.breakdown())
                    .matchReasons(s.reasons())
                    .trustBadge(trustBadge(h.getReviewCount(), u != null && u.isIdentityVerified()))
                    .verification(ProviderVerificationDto.forHost(
                            u != null && u.isIdentityVerified(),
                            u != null && u.isPhoneVerified(),
                            h.isLocationVerified()))
                    .pricePerNight(h.getPricePerNight() != null ? h.getPricePerNight().doubleValue() : null)
                    .distanceKm(dist)
                    .location(h.getCity())
                    .initials(initials(name))
                    .build();
        }).collect(Collectors.toList());
    }

    private List<MatchResultDto> findGuideMatches(User seeker, MatchFindRequest request) {
        String city = GhanaReference.normalizeCity(request.getCity());
        List<GuideProfile> guides = request.getCity() != null
                ? guideProfileRepository.findByCityIgnoreCaseAndActiveTrue(city)
                : guideProfileRepository.findByActiveTrue();
        Map<UUID, User> users = loadUsers(guides.stream().map(GuideProfile::getUserId).collect(Collectors.toSet()));
        // Marketplace integrity: only staff-verified guides are bookable / shown in matches.
        List<GuideProfile> verifiedGuides = guides.stream()
                .filter(g -> {
                    User u = users.get(g.getUserId());
                    return u != null && u.isIdentityVerified();
                })
                .collect(Collectors.toList());
        List<MatchingAlgorithm.ScoredGuide> scored = algorithm.scoreGuides(verifiedGuides, users, request, seeker);

        return scored.stream().limit(20).map(s -> {
            GuideProfile g = s.guide();
            User u = s.guideUser();
            MatchRecord record = persistMatch(seeker.getUserId(), g.getGuideId(), "GUIDE", s.score(), s.breakdown(), s.reasons());
            String name = u != null ? u.getFullName() : "Guide";
            String photo = g.getPhotos() != null && !g.getPhotos().isEmpty() ? g.getPhotos().get(0)
                    : (u != null ? u.getProfilePhotoUrl() : null);
            return MatchResultDto.builder()
                    .matchId(record.getMatchId().toString())
                    .targetId(g.getGuideId().toString())
                    .targetType("GUIDE")
                    .targetName(name)
                    .targetPhotoUrl(photo)
                    .compatibilityScore(s.score())
                    .scoreBreakdown(s.breakdown())
                    .matchReasons(s.reasons())
                    .trustBadge(trustBadge(g.getReviewCount(), u != null && u.isIdentityVerified()))
                    .verification(ProviderVerificationDto.forGuide(
                            u != null && u.isIdentityVerified(),
                            u != null && u.isPhoneVerified(),
                            g.isExperienceVerified()))
                    .pricePerNight(g.getPricePerSession() != null ? g.getPricePerSession().doubleValue() : null)
                    .distanceKm(distanceKm(g.getLat(), g.getLng(), request.getUniversityLat(), request.getUniversityLng()))
                    .location(g.getCity())
                    .initials(initials(name))
                    .build();
        }).collect(Collectors.toList());
    }

    private MatchRecord persistMatch(UUID seekerId, UUID targetId, String type, double score,
                                     Map<String, Double> breakdown, List<String> reasons) {
        Map<String, Object> breakdownObj = new LinkedHashMap<>(breakdown);
        return matchRecordRepository.save(MatchRecord.builder()
                .seekerId(seekerId)
                .targetId(targetId)
                .targetType(type)
                .compatibilityScore(BigDecimal.valueOf(score))
                .scoreBreakdown(breakdownObj)
                .matchReasons(reasons)
                .build());
    }

    private Map<UUID, User> loadUsers(Set<UUID> ids) {
        if (ids.isEmpty()) return Map.of();
        return userRepository.findAllById(ids).stream().collect(Collectors.toMap(User::getUserId, u -> u));
    }

    private String searchHash(MatchFindRequest req) {
        try {
            String raw = objectMapper.writeValueAsString(req);
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return String.valueOf(req.hashCode());
        }
    }

    private String trustBadge(int reviews, boolean verified) {
        if (verified && reviews >= 10) return "PRO";
        if (verified && reviews >= 3) return "TRUSTED";
        if (verified) return "VERIFIED";
        return "NEW";
    }

    private String initials(String name) {
        if (name == null || name.isBlank()) return "??";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

    private Double distanceKm(BigDecimal lat1, BigDecimal lng1, BigDecimal lat2, BigDecimal lng2) {
        if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
        double R = 6371;
        double dLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double dLon = Math.toRadians(lng2.doubleValue() - lng1.doubleValue());
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1.doubleValue())) * Math.cos(Math.toRadians(lat2.doubleValue()))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10.0;
    }
}

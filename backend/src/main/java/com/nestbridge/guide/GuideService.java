package com.nestbridge.guide;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GuideService {

    private final GuideProfileRepository guideProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public GuideProfileDto getById(UUID guideId) {
        GuideProfile guide = guideProfileRepository.findById(guideId)
                .orElseThrow(() -> new IllegalArgumentException("Guide not found."));
        User user = userRepository.findById(guide.getUserId()).orElse(null);
        return toDto(guide, user, null, null);
    }

    @Transactional
    public GuideProfileDto upsertProfile(UUID userId, GuideProfileRequest request) {
        GuideProfile guide = guideProfileRepository.findByUserId(userId)
                .orElse(GuideProfile.builder().userId(userId).active(false).build());
        applyRequest(guide, request);
        guide = guideProfileRepository.save(guide);
        User user = userRepository.findById(userId).orElse(null);
        return toDto(guide, user, null, null);
    }

    static GuideProfileDto toDto(GuideProfile guide, User user, Integer matchPct, java.util.List<String> reasons) {
        String name = user != null ? user.getFullName() : "Guide";
        String initials = name.length() >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
        return GuideProfileDto.builder()
                .guideId(guide.getGuideId())
                .userId(guide.getUserId())
                .name(name)
                .initials(initials)
                .city(guide.getCity())
                .country(guide.getCountry())
                .serviceTypes(guide.getServiceTypes())
                .languagesOffered(guide.getLanguagesOffered())
                .pricePerSession(guide.getPricePerSession())
                .sessionDurationHours(guide.getSessionDurationHours())
                .bioExtended(guide.getBioExtended())
                .photos(guide.getPhotos())
                .active(guide.isActive())
                .reviewCount(guide.getReviewCount())
                .averageRating(guide.getAverageRating())
                .matchPercentage(matchPct)
                .matchReasons(reasons)
                .build();
    }

    private void applyRequest(GuideProfile guide, GuideProfileRequest request) {
        if (request.getCity() != null) guide.setCity(request.getCity());
        if (request.getCountry() != null) guide.setCountry(request.getCountry());
        if (request.getServiceTypes() != null) guide.setServiceTypes(request.getServiceTypes());
        if (request.getLanguagesOffered() != null) guide.setLanguagesOffered(request.getLanguagesOffered());
        if (request.getPricePerSession() != null) guide.setPricePerSession(request.getPricePerSession());
        if (request.getSessionDurationHours() != null) guide.setSessionDurationHours(request.getSessionDurationHours());
        if (request.getBioExtended() != null) guide.setBioExtended(request.getBioExtended());
        if (request.getPhotos() != null) guide.setPhotos(request.getPhotos());
        if (request.getActive() != null) guide.setActive(request.getActive());
        if (request.getLat() != null) guide.setLat(request.getLat());
        if (request.getLng() != null) guide.setLng(request.getLng());
    }
}

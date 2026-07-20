package com.nestbridge.guide;

import com.nestbridge.common.ProviderVerificationDto;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

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

    @Transactional(readOnly = true)
    public GuideProfileDto getMyProfile(UUID userId) {
        GuideProfile guide = guideProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guide profile not found."));
        User user = userRepository.findById(userId).orElse(null);
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

    @Transactional(readOnly = true)
    public List<GuideCalendarDayDto> getMyCalendar(UUID userId, int year, int month) {
        GuideProfile guide = guideProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guide profile not found."));
        Map<String, Object> schedule = guide.getAvailabilitySchedule() != null
                ? guide.getAvailabilitySchedule()
                : Collections.emptyMap();

        LocalDate monthStart = LocalDate.of(year, month, 1);
        int daysInMonth = monthStart.lengthOfMonth();
        List<GuideCalendarDayDto> days = new ArrayList<>(daysInMonth);
        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month, day);
            List<String> shifts = parseShifts(schedule.get(date.toString()));
            days.add(GuideCalendarDayDto.builder()
                    .date(date.toString())
                    .day(day)
                    .shifts(shifts)
                    .build());
        }
        return days;
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
                .availabilitySchedule(guide.getAvailabilitySchedule())
                .matchPercentage(matchPct)
                .matchReasons(reasons)
                .verification(ProviderVerificationDto.forGuide(
                        user != null && user.isIdentityVerified(),
                        user != null && user.isPhoneVerified(),
                        guide.isExperienceVerified()))
                .build();
    }

    @SuppressWarnings("unchecked")
    private List<String> parseShifts(Object raw) {
        if (raw == null) {
            return List.of();
        }
        if (raw instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
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
        if (request.getAvailabilitySchedule() != null) guide.setAvailabilitySchedule(request.getAvailabilitySchedule());
    }
}

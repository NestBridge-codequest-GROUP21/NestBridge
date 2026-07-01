package com.nestbridge.host;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HostService {

    private final HostProfileRepository hostProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public HostProfileDto getById(UUID hostId) {
        HostProfile host = hostProfileRepository.findById(hostId)
                .orElseThrow(() -> new IllegalArgumentException("Host not found."));
        User user = userRepository.findById(host.getUserId()).orElse(null);
        return toDto(host, user, null, null);
    }

    @Transactional
    public HostProfileDto upsertProfile(UUID userId, HostProfileRequest request) {
        HostProfile host = hostProfileRepository.findByUserId(userId)
                .orElse(HostProfile.builder().userId(userId).active(false).build());
        applyRequest(host, request);
        host = hostProfileRepository.save(host);
        User user = userRepository.findById(userId).orElse(null);
        return toDto(host, user, null, null);
    }

    static HostProfileDto toDto(HostProfile host, User user, Integer matchPct, java.util.List<String> reasons) {
        String name = user != null ? user.getFullName() : "Host";
        String initials = name.length() >= 2
                ? name.substring(0, 2).toUpperCase()
                : name.toUpperCase();
        return HostProfileDto.builder()
                .hostId(host.getHostId())
                .userId(host.getUserId())
                .hostName(name)
                .initials(initials)
                .address(host.getAddress())
                .city(host.getCity())
                .country(host.getCountry())
                .lat(host.getLat())
                .lng(host.getLng())
                .roomType(host.getRoomType())
                .maxGuests(host.getMaxGuests())
                .pricePerNight(host.getPricePerNight())
                .amenities(host.getAmenities())
                .houseRules(host.getHouseRules())
                .dietOffered(host.getDietOffered())
                .cancellationPolicy(host.getCancellationPolicy())
                .photos(host.getPhotos())
                .active(host.isActive())
                .reviewCount(host.getReviewCount())
                .averageRating(host.getAverageRating())
                .matchPercentage(matchPct)
                .matchReasons(reasons)
                .build();
    }

    private void applyRequest(HostProfile host, HostProfileRequest request) {
        if (request.getAddress() != null) host.setAddress(request.getAddress());
        if (request.getCity() != null) host.setCity(request.getCity());
        if (request.getCountry() != null) host.setCountry(request.getCountry());
        if (request.getLat() != null) host.setLat(request.getLat());
        if (request.getLng() != null) host.setLng(request.getLng());
        if (request.getRoomType() != null) host.setRoomType(request.getRoomType());
        if (request.getMaxGuests() != null) host.setMaxGuests(request.getMaxGuests());
        if (request.getPricePerNight() != null) host.setPricePerNight(request.getPricePerNight());
        if (request.getAmenities() != null) host.setAmenities(request.getAmenities());
        if (request.getHouseRules() != null) host.setHouseRules(request.getHouseRules());
        if (request.getDietOffered() != null) host.setDietOffered(request.getDietOffered());
        if (request.getCancellationPolicy() != null) host.setCancellationPolicy(request.getCancellationPolicy());
        if (request.getPhotos() != null) host.setPhotos(request.getPhotos());
        if (request.getActive() != null) host.setActive(request.getActive());
    }
}

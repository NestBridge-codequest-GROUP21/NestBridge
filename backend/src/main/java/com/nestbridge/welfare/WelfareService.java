package com.nestbridge.welfare;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WelfareService {

    private final SosEventRepository sosEventRepository;

    @Transactional
    public SosEventDto logSos(UUID userId, SosRequest request) {
        SosEvent event = SosEvent.builder()
                .userId(userId)
                .locationLat(request.getLocationLat())
                .locationLng(request.getLocationLng())
                .contactedEmergency(Boolean.TRUE.equals(request.getContactedEmergency()))
                .contactedSupport(Boolean.TRUE.equals(request.getContactedSupport()))
                .build();
        event = sosEventRepository.save(event);
        return toDto(event);
    }

    public java.util.List<SosEventDto> getCheckInsForBooking(UUID bookingId) {
        // Stub: welfare check-ins scheduled out of sprint scope
        return java.util.List.of();
    }

    private SosEventDto toDto(SosEvent e) {
        return SosEventDto.builder()
                .sosId(e.getSosId())
                .userId(e.getUserId())
                .triggeredAt(e.getTriggeredAt())
                .locationLat(e.getLocationLat())
                .locationLng(e.getLocationLng())
                .contactedEmergency(e.isContactedEmergency())
                .contactedSupport(e.isContactedSupport())
                .build();
    }
}

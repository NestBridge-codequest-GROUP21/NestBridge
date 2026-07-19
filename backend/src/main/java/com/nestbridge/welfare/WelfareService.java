package com.nestbridge.welfare;

import com.nestbridge.booking.Booking;
import com.nestbridge.booking.BookingRepository;
import com.nestbridge.common.BookingStatus;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.notification.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WelfareService {

    private static final EnumSet<BookingStatus> CHECK_IN_STATUSES = EnumSet.of(
            BookingStatus.ACCEPTED,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN);

    private final SosEventRepository sosEventRepository;
    private final WelfareCheckInRepository welfareCheckInRepository;
    private final BookingRepository bookingRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final EmailService emailService;

    @Value("${welfare.support-alert-email:}")
    private String supportAlertEmail;

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
        notifySupportIfConfigured("NestBridge SOS alert",
                "User %s triggered SOS at %s (emergency=%s, support=%s, lat=%s, lng=%s)."
                        .formatted(
                                userId,
                                event.getTriggeredAt(),
                                event.isContactedEmergency(),
                                event.isContactedSupport(),
                                event.getLocationLat(),
                                event.getLocationLng()));
        return toSosDto(event);
    }

    public List<WelfareCheckInDto> getCheckInsForBooking(UUID bookingId, UUID requesterId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        requireBookingParticipant(booking, requesterId);
        return welfareCheckInRepository.findByBookingIdOrderByCompletedAtDesc(bookingId).stream()
                .map(this::toCheckInDto)
                .toList();
    }

    @Transactional
    public WelfareCheckInDto submitCheckIn(UUID userId, UUID bookingId, SubmitWelfareCheckInRequest request) {
        if (request.getResponses() == null || request.getResponses().isEmpty()) {
            throw new IllegalArgumentException("Please answer all welfare check-in questions.");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        if (!booking.getGuestId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the guest can submit this check-in.");
        }
        if (!CHECK_IN_STATUSES.contains(booking.getStatus())) {
            throw new IllegalArgumentException("This booking is not active.");
        }
        if (welfareCheckInRepository.findByBookingIdAndUserId(bookingId, userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already completed this welfare check-in.");
        }

        boolean flagged = request.getResponses().values().stream().anyMatch(value -> Boolean.FALSE.equals(value));
        Map<String, Object> responses = new HashMap<>();
        request.getResponses().forEach(responses::put);

        WelfareCheckIn checkIn = WelfareCheckIn.builder()
                .bookingId(bookingId)
                .userId(userId)
                .scheduledAt(OffsetDateTime.now())
                .completedAt(OffsetDateTime.now())
                .responses(responses)
                .flagged(flagged)
                .escalated(false)
                .build();
        checkIn = welfareCheckInRepository.save(checkIn);

        if (flagged) {
            notifySupportIfConfigured("NestBridge welfare check-in flagged",
                    "Booking %s for guest %s was flagged during welfare check-in %s."
                            .formatted(bookingId, userId, checkIn.getCheckinId()));
        }

        return toCheckInDto(checkIn);
    }

    private void requireBookingParticipant(Booking booking, UUID userId) {
        if (booking.getGuestId().equals(userId)) {
            return;
        }
        UUID providerUserId = resolveProviderUserId(booking);
        if (providerUserId != null && providerUserId.equals(userId)) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to view these check-ins.");
    }

    private UUID resolveProviderUserId(Booking booking) {
        if (booking.getHostOrGuideId() == null) {
            return null;
        }
        return switch (booking.getBookingType()) {
            case HOST -> hostProfileRepository.findById(booking.getHostOrGuideId())
                    .map(host -> host.getUserId())
                    .orElse(null);
            case GUIDE -> guideProfileRepository.findById(booking.getHostOrGuideId())
                    .map(guide -> guide.getUserId())
                    .orElse(null);
        };
    }

    private void notifySupportIfConfigured(String subject, String body) {
        if (supportAlertEmail == null || supportAlertEmail.isBlank()) {
            return;
        }
        emailService.sendPlainEmail(supportAlertEmail, subject, body);
    }

    private WelfareCheckInDto toCheckInDto(WelfareCheckIn checkIn) {
        return WelfareCheckInDto.builder()
                .checkinId(checkIn.getCheckinId().toString())
                .bookingId(checkIn.getBookingId().toString())
                .scheduledAt(checkIn.getScheduledAt() != null ? checkIn.getScheduledAt().toString() : null)
                .completedAt(checkIn.getCompletedAt() != null ? checkIn.getCompletedAt().toString() : null)
                .flagged(checkIn.isFlagged())
                .build();
    }

    private SosEventDto toSosDto(SosEvent event) {
        return SosEventDto.builder()
                .sosId(event.getSosId())
                .userId(event.getUserId())
                .triggeredAt(event.getTriggeredAt())
                .locationLat(event.getLocationLat())
                .locationLng(event.getLocationLng())
                .contactedEmergency(event.isContactedEmergency())
                .contactedSupport(event.isContactedSupport())
                .build();
    }
}

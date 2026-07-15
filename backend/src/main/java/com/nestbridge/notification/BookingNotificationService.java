package com.nestbridge.notification;

import com.nestbridge.booking.Booking;
import com.nestbridge.common.BookingType;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingNotificationService {

    private final UserRepository userRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;
    private final InAppNotificationRepository notificationRepository;

    @Async
    public void onBookingCreated(Booking booking) {
        UUID providerUserId = resolveProviderUserId(booking);
        if (providerUserId == null) return;
        User guest = userRepository.findById(booking.getGuestId()).orElse(null);
        String guestName = guest != null ? guest.getFullName() : "A guest";
        String typeLabel = booking.getBookingType() == BookingType.HOST ? "homestay" : "guide session";
        String title = "New " + typeLabel + " request";
        String body = guestName + " requested a " + typeLabel + ".";
        notifyUser(providerUserId, "BOOKING_REQUEST", title, body,
                Map.of("bookingId", booking.getBookingId().toString()));
    }

    @Async
    public void onBookingAccepted(Booking booking) {
        User guest = userRepository.findById(booking.getGuestId()).orElse(null);
        if (guest == null) return;
        String title = "Request accepted";
        String body = "Your booking was accepted. Open NestBridge to pay now.";
        notifyUser(guest.getUserId(), "BOOKING_ACCEPTED", title, body,
                Map.of("bookingId", booking.getBookingId().toString()));
        emailService.sendPlainEmail(guest.getEmail(), title, body);
    }

    @Async
    public void onBookingDeclined(Booking booking) {
        User guest = userRepository.findById(booking.getGuestId()).orElse(null);
        if (guest == null) return;
        String title = "Request declined";
        String body = "Your booking request was declined. You can search for other matches.";
        notifyUser(guest.getUserId(), "BOOKING_DECLINED", title, body,
                Map.of("bookingId", booking.getBookingId().toString()));
        emailService.sendPlainEmail(guest.getEmail(), title, body);
    }

    @Async
    public void onBookingConfirmed(Booking booking) {
        User guest = userRepository.findById(booking.getGuestId()).orElse(null);
        UUID providerUserId = resolveProviderUserId(booking);
        String title = "Booking confirmed";
        if (guest != null) {
            String body = "Payment received. Your stay is confirmed.";
            notifyUser(guest.getUserId(), "BOOKING_CONFIRMED", title, body,
                    Map.of("bookingId", booking.getBookingId().toString()));
            emailService.sendPlainEmail(guest.getEmail(), title, body);
        }
        if (providerUserId != null) {
            String providerBody = "A guest completed payment. The booking is confirmed.";
            notifyUser(providerUserId, "BOOKING_CONFIRMED", title, providerBody,
                    Map.of("bookingId", booking.getBookingId().toString()));
            userRepository.findById(providerUserId).ifPresent(
                    provider -> emailService.sendPlainEmail(provider.getEmail(), title, providerBody));
        }
    }

    @Transactional
    protected void notifyUser(UUID userId, String type, String title, String body, Map<String, Object> data) {
        notificationRepository.save(InAppNotification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .data(data)
                .build());
        pushNotificationService.sendToUser(userId, title, body, data);
    }

    private UUID resolveProviderUserId(Booking booking) {
        if (booking.getBookingType() == BookingType.HOST) {
            return hostProfileRepository.findById(booking.getHostOrGuideId())
                    .map(h -> h.getUserId())
                    .orElse(null);
        }
        return guideProfileRepository.findById(booking.getHostOrGuideId())
                .map(g -> g.getUserId())
                .orElse(null);
    }
}

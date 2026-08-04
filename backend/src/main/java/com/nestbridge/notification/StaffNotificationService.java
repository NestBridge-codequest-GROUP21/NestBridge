package com.nestbridge.notification;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffNotificationService {

    private final UserRepository userRepository;
    private final PushNotificationService pushNotificationService;
    private final InAppNotificationRepository notificationRepository;
    private final NotificationDeliveryFailureRepository failureRepository;
    private final EmailService emailService;

    @Async
    public void onManualKycPending(User subject) {
        if (subject == null) {
            return;
        }
        List<User> staff = userRepository.findByStaffTrue();
        if (staff.isEmpty()) {
            log.warn("Manual KYC pending for {} but no staff users to notify", subject.getUserId());
            return;
        }
        String name = subject.getFullName() != null && !subject.getFullName().isBlank()
                ? subject.getFullName()
                : subject.getEmail();
        String title = "KYC review needed";
        String body = name + " requested identity verification. Review and force-verify if appropriate.";
        Map<String, Object> data = Map.of("userId", subject.getUserId().toString());
        for (User staffUser : staff) {
            notifyUser(staffUser.getUserId(), "KYC_PENDING", title, body, data, false);
        }
    }

    @Async
    public void onKycApproved(User subject) {
        if (subject == null) {
            return;
        }
        String title = "You're verified";
        String body =
                "NestBridge staff approved your identity. You can now host, guide, and accept bookings.";
        Map<String, Object> data = Map.of("userId", subject.getUserId().toString());
        notifyUser(subject.getUserId(), "KYC_APPROVED", title, body, data, true);
    }

    @Async
    public void onKycRejected(User subject, String reason) {
        if (subject == null) {
            return;
        }
        String safeReason = reason == null || reason.isBlank()
                ? "Please update your details and try again."
                : reason.trim();
        String title = "Verification not approved";
        String body = "Your identity verification was rejected. Reason: " + safeReason;
        Map<String, Object> data = Map.of(
                "userId", subject.getUserId().toString(),
                "reason", safeReason);
        notifyUser(subject.getUserId(), "KYC_REJECTED", title, body, data, true);
    }

    @Transactional
    protected void notifyUser(
            UUID userId,
            String type,
            String title,
            String body,
            Map<String, Object> data,
            boolean emailFallback) {
        notificationRepository.save(InAppNotification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .data(data)
                .build());
        boolean pushed = pushNotificationService.sendToUser(userId, title, body, data);
        if (!pushed) {
            failureRepository.save(NotificationDeliveryFailure.builder()
                    .userId(userId)
                    .notificationType(type)
                    .title(title)
                    .body(body)
                    .dataJson(data)
                    .attempts(1)
                    .maxAttempts(5)
                    .nextAttemptAt(OffsetDateTime.now().plusMinutes(15))
                    .lastError("Push delivery failed or no device tokens")
                    .build());
        }
        if (emailFallback && type.startsWith("KYC_")) {
            sendKycEmailFallback(userId, title, body);
        }
    }

    private void sendKycEmailFallback(UUID userId, String title, String body) {
        userRepository.findById(userId).ifPresent(user -> {
            if (!emailService.isConfigured()) {
                return;
            }
            try {
                emailService.sendPlainEmail(
                        user.getEmail(),
                        title,
                        "Hi " + user.getFullName() + ",\n\n" + body + "\n\n— The NestBridge team\n");
            } catch (Exception e) {
                log.warn("KYC email fallback failed for {}: {}", userId, e.getMessage());
            }
        });
    }
}

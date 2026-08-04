package com.nestbridge.notification;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            notifyUser(staffUser.getUserId(), "KYC_PENDING", title, body, data);
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
}

package com.nestbridge.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationQueryService {

    private final InAppNotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> listForUser(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void markRead(UUID userId, UUID notificationId) {
        InAppNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized.");
        }
        notification.setReadAt(OffsetDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllRead(UUID userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(n -> n.getReadAt() == null)
                .forEach(n -> {
                    n.setReadAt(OffsetDateTime.now());
                    notificationRepository.save(n);
                });
    }

    private NotificationDto toDto(InAppNotification n) {
        return NotificationDto.builder()
                .id(n.getNotificationId().toString())
                .type(n.getType())
                .title(n.getTitle())
                .body(n.getBody())
                .read(n.getReadAt() != null)
                .createdAt(n.getCreatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                .data(n.getData())
                .build();
    }
}

package com.nestbridge.notification;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final InAppNotificationRepository notificationRepository;
    private final NotificationQueryService notificationQueryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> list(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                "Notifications retrieved",
                notificationQueryService.listForUser(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(
            Authentication authentication,
            @PathVariable UUID id) {
        UUID userId = (UUID) authentication.getPrincipal();
        notificationQueryService.markRead(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        notificationQueryService.markAllRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        long count = notificationRepository.countByUserIdAndReadAtIsNull(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }
}

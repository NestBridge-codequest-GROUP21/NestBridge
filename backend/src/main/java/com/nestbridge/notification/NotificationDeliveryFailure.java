package com.nestbridge.notification;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "notification_delivery_failures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDeliveryFailure {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "failure_id")
    private UUID failureId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "notification_type", nullable = false, length = 64)
    private String notificationType;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "data_json", columnDefinition = "jsonb")
    private Map<String, Object> dataJson;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts;

    @Column(name = "next_attempt_at", nullable = false)
    private OffsetDateTime nextAttemptAt;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (nextAttemptAt == null) {
            nextAttemptAt = OffsetDateTime.now();
        }
        if (maxAttempts <= 0) {
            maxAttempts = 5;
        }
    }
}

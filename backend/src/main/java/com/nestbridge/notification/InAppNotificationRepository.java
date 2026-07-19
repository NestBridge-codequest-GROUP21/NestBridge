package com.nestbridge.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InAppNotificationRepository extends JpaRepository<InAppNotification, UUID> {

    long countByUserIdAndReadAtIsNull(UUID userId);

    List<InAppNotification> findByUserIdOrderByCreatedAtDesc(UUID userId);
}

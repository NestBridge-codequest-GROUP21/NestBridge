package com.nestbridge.notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface NotificationDeliveryFailureRepository
        extends JpaRepository<NotificationDeliveryFailure, UUID> {

    List<NotificationDeliveryFailure> findByResolvedAtIsNullAndNextAttemptAtBeforeOrderByNextAttemptAtAsc(
            OffsetDateTime now,
            Pageable pageable);
}

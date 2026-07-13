package com.nestbridge.events;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventAttendeeRepository extends JpaRepository<EventAttendee, UUID> {

    long countByEventId(UUID eventId);

    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);

    void deleteByEventIdAndUserId(UUID eventId, UUID userId);

    List<EventAttendee> findByUserId(UUID userId);

    List<EventAttendee> findByEventIdIn(List<UUID> eventIds);
}

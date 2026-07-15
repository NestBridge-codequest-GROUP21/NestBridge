package com.nestbridge.welfare;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WelfareCheckInRepository extends JpaRepository<WelfareCheckIn, UUID> {

    List<WelfareCheckIn> findByBookingIdOrderByCompletedAtDesc(UUID bookingId);

    Optional<WelfareCheckIn> findByBookingIdAndUserId(UUID bookingId, UUID userId);
}

package com.nestbridge.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, UUID> {

    Optional<PaymentRecord> findByPaystackReference(String paystackReference);

    Optional<PaymentRecord> findTopByBookingIdOrderByCreatedAtDesc(UUID bookingId);

    Optional<PaymentRecord> findTopByBookingIdAndStatusOrderByCreatedAtDesc(
            UUID bookingId,
            String status);

    List<PaymentRecord> findByBookingIdAndStatus(UUID bookingId, String status);

    boolean existsByBookingIdAndStatus(UUID bookingId, String status);
}

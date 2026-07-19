package com.nestbridge.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, UUID> {

    Optional<PaymentRecord> findByPaystackReference(String paystackReference);

    Optional<PaymentRecord> findTopByBookingIdOrderByCreatedAtDesc(UUID bookingId);
}

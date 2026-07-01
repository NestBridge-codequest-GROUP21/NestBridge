package com.nestbridge.booking;

import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "match_id")
    private UUID matchId;

    @Column(name = "guest_id")
    private UUID guestId;

    @Column(name = "host_or_guide_id")
    private UUID hostOrGuideId;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type")
    private BookingType bookingType;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "session_start_time")
    private String sessionStartTime;

    @Column(name = "session_duration_hours")
    private BigDecimal sessionDurationHours;

    @Column(name = "guest_message")
    private String guestMessage;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "platform_fee")
    private BigDecimal platformFee;

    @Column(name = "host_payout")
    private BigDecimal hostPayout;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) paymentStatus = "PENDING";
        if (status == null) status = BookingStatus.PENDING_HOST;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

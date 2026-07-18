package com.nestbridge.admin;

import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminBookingActivityDto {
    private UUID bookingId;
    private BookingType bookingType;
    private BookingStatus status;
    private String paymentStatus;
    private UUID guestId;
    private UUID hostOrGuideId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private LocalDate sessionDate;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}

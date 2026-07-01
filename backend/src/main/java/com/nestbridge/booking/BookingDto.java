package com.nestbridge.booking;

import com.nestbridge.common.BookingStatus;
import com.nestbridge.common.BookingType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class BookingDto {
    private UUID bookingId;
    private UUID matchId;
    private UUID guestId;
    private UUID hostOrGuideId;
    private BookingType bookingType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private LocalDate sessionDate;
    private String sessionStartTime;
    private BigDecimal sessionDurationHours;
    private String guestMessage;
    private BigDecimal totalPrice;
    private BigDecimal platformFee;
    private BigDecimal hostPayout;
    private String paymentStatus;
    private BookingStatus status;
    private String guestName;
    private String guestInitials;
    private String providerName;
    private String providerInitials;
    private String providerLocation;
    private Double compatibilityScore;
}

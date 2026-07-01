package com.nestbridge.booking;

import com.nestbridge.common.BookingType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateBookingRequest {
    private UUID matchId;
    private BookingType bookingType;
    private UUID hostOrGuideId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private LocalDate sessionDate;
    private String sessionStartTime;
    private BigDecimal sessionDurationHours;
    private String guestMessage;
    private BigDecimal nightlyRate;
    private BigDecimal sessionRate;
}

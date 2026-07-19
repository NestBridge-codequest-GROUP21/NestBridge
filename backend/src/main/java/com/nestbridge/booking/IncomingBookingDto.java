package com.nestbridge.booking;

import com.nestbridge.common.BookingType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class IncomingBookingDto {
    private UUID id;
    private BookingType bookingType;
    private String seekerRole;
    private UUID studentId;
    private String studentName;
    private String studentInitials;
    private String studentOrigin;
    private String studentUniversity;
    private Double compatibilityScore;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private LocalDate sessionDate;
    private String sessionStartTime;
    private BigDecimal sessionDurationHours;
    private String message;
    private BigDecimal nightlyRate;
    private BigDecimal totalPrice;
    private BigDecimal platformFee;
    private Integer nights;
    private String cancellationPolicy;
    private Integer overlappingAccepted;
    private Integer maxAllowed;
    private Boolean canAccept;
    private String declineReason;
}

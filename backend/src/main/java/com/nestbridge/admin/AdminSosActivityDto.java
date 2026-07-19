package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminSosActivityDto {
    private UUID sosId;
    private LocalDateTime triggeredAt;
    private BigDecimal locationLat;
    private BigDecimal locationLng;
    private boolean contactedEmergency;
    private boolean contactedSupport;
}

package com.nestbridge.welfare;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SosEventDto {
    private UUID sosId;
    private UUID userId;
    private LocalDateTime triggeredAt;
    private BigDecimal locationLat;
    private BigDecimal locationLng;
    private boolean contactedEmergency;
    private boolean contactedSupport;
}

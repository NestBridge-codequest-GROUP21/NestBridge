package com.nestbridge.welfare;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SosRequest {
    private BigDecimal locationLat;
    private BigDecimal locationLng;
    private Boolean contactedEmergency;
    private Boolean contactedSupport;
}

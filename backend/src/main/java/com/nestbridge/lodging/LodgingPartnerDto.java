package com.nestbridge.lodging;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class LodgingPartnerDto {
    private UUID partnerId;
    private String name;
    private String city;
    private String category;
    private String address;
    private String phone;
    private String email;
    private String websiteUrl;
    private String bookingUrl;
    private BigDecimal priceFrom;
    private String currency;
    private String description;
}

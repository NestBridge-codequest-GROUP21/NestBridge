package com.nestbridge.guide;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class GuideProfileRequest {
    private String city;
    private String country;
    private List<String> serviceTypes;
    private List<String> languagesOffered;
    private BigDecimal pricePerSession;
    private BigDecimal sessionDurationHours;
    private String bioExtended;
    private List<String> photos;
    private Boolean active;
    private BigDecimal lat;
    private BigDecimal lng;
}

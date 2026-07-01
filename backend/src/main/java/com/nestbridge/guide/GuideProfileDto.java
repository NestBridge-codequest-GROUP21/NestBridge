package com.nestbridge.guide;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GuideProfileDto {
    private UUID guideId;
    private UUID userId;
    private String name;
    private String initials;
    private String city;
    private String country;
    private List<String> serviceTypes;
    private List<String> languagesOffered;
    private BigDecimal pricePerSession;
    private BigDecimal sessionDurationHours;
    private String bioExtended;
    private List<String> photos;
    private boolean active;
    private int reviewCount;
    private BigDecimal averageRating;
    private Integer matchPercentage;
    private List<String> matchReasons;
}

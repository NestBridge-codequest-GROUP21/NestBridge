package com.nestbridge.recommendation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class RecommendationItemDto {
    private String id;
    /** INSTITUTION | HOST | GUIDE | SITE | LODGING | TRANSPORT | CULTURE | RESOURCE | PROFILE_TIP | OPPORTUNITY */
    private String type;
    private String title;
    private String subtitle;
    private String icon;
    private String reason;
    private String targetId;
    private String routeHint;
    private Double matchPercentage;
    private String priceLabel;
}

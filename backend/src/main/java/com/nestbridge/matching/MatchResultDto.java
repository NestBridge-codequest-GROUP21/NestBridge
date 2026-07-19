package com.nestbridge.matching;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class MatchResultDto {
    private String matchId;
    private String targetId;
    private String targetType;
    private String targetName;
    private String targetPhotoUrl;
    private Double compatibilityScore;
    private Map<String, Double> scoreBreakdown;
    private List<String> matchReasons;
    private String trustBadge;
    private Double pricePerNight;
    private Double distanceKm;
    private String location;
    private String initials;
}

package com.nestbridge.matching;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class MatchFindRequest {
    private String city;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BigDecimal minBudget;
    private BigDecimal maxBudget;
    private String targetType;
    private BigDecimal universityLat;
    private BigDecimal universityLng;
    private List<String> preferredLanguages;
    private List<String> dietaryRequirements;
    private String lifestylePreference;
    private String culturalBackgroundPreference;
    private String religionPreference;
}

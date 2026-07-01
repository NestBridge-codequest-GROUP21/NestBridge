package com.nestbridge.host;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class HostProfileDto {
    private UUID hostId;
    private UUID userId;
    private String hostName;
    private String initials;
    private String address;
    private String city;
    private String country;
    private BigDecimal lat;
    private BigDecimal lng;
    private String roomType;
    private Integer maxGuests;
    private BigDecimal pricePerNight;
    private List<String> amenities;
    private String houseRules;
    private List<String> dietOffered;
    private String cancellationPolicy;
    private List<String> photos;
    private boolean active;
    private int reviewCount;
    private BigDecimal averageRating;
    private Integer matchPercentage;
    private List<String> matchReasons;
}

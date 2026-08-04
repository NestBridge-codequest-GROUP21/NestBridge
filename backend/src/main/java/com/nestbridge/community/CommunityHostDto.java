package com.nestbridge.community;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CommunityHostDto {
    private String hostId;
    private String userId;
    private String fullName;
    private String initials;
    private String bio;
    private String city;
    private String address;
    private String roomType;
    private BigDecimal pricePerNight;
    private BigDecimal averageRating;
    private int reviewCount;
    private boolean identityVerified;
}

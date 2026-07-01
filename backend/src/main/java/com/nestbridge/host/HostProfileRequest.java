package com.nestbridge.host;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class HostProfileRequest {
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
    private Boolean active;
}

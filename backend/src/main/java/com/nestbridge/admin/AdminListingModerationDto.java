package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminListingModerationDto {
    private UUID listingId;
    private String type;
    private UUID ownerUserId;
    private String ownerName;
    private String ownerEmail;
    private String city;
    private boolean active;
    private boolean hidden;
}

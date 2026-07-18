package com.nestbridge.admin;

import com.nestbridge.common.ProfileStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminListingStatusDto {
    private String type;
    private UUID listingId;
    private boolean active;
    private boolean hidden;
    private ProfileStatus setupStatus;
    private String city;
}

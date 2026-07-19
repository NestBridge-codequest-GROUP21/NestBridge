package com.nestbridge.admin;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminListingHideResultDto {
    private UUID listingId;
    private String type;
    private boolean active;
    private boolean hidden;
}

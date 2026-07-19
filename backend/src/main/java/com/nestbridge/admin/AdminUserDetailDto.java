package com.nestbridge.admin;

import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminUserDetailDto {
    private UUID userId;
    private String fullName;
    private String email;
    private PrimaryIntent primaryIntent;
    private boolean identityVerified;
    private boolean emailVerified;
    private boolean staff;
    private boolean suspended;
    private String nationality;
    private ProfileStatus seekerSetupStatus;
    private List<AdminListingStatusDto> listings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

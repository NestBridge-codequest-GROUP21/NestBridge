package com.nestbridge.admin;

import com.nestbridge.common.PrimaryIntent;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminUserSummaryDto {
    private UUID userId;
    private String fullName;
    private String email;
    private PrimaryIntent primaryIntent;
    private boolean identityVerified;
    private boolean emailVerified;
    private boolean staff;
    private boolean suspended;
}

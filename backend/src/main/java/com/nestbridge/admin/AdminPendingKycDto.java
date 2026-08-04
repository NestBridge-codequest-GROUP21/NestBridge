package com.nestbridge.admin;

import com.nestbridge.common.PrimaryIntent;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminPendingKycDto {
    private UUID jobId;
    private UUID userId;
    private String fullName;
    private String email;
    private PrimaryIntent primaryIntent;
    private String provider;
    private OffsetDateTime createdAt;
}

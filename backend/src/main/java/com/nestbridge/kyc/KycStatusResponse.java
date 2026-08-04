package com.nestbridge.kyc;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class KycStatusResponse {
    /** pending | approved | rejected | none */
    private String status;
    private String rejectionReason;
    private String jobId;
    private String provider;
    private OffsetDateTime updatedAt;
    private boolean identityVerified;
}

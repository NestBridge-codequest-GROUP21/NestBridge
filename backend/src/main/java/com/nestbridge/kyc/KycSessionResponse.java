package com.nestbridge.kyc;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KycSessionResponse {

    private boolean enabled;
    private String verificationUrl;
    private String jobId;
    private String message;
}

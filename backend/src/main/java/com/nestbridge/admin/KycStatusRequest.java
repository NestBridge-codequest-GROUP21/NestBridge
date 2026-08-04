package com.nestbridge.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class KycStatusRequest {

    /** true = force-verify, false = reject / clear verification */
    @NotNull(message = "identityVerified is required.")
    private Boolean identityVerified;

    /** Required when identityVerified is false. */
    @Size(max = 1000, message = "reason must be at most 1000 characters.")
    private String reason;
}

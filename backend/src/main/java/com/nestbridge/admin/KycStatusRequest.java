package com.nestbridge.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KycStatusRequest {

    /** true = force-verify, false = clear verification flag */
    @NotNull(message = "identityVerified is required.")
    private Boolean identityVerified;
}

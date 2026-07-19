package com.nestbridge.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuspendUserRequest {

    /** true = suspend, false = unsuspend */
    @NotNull(message = "suspended is required.")
    private Boolean suspended;
}

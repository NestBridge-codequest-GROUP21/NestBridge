package com.nestbridge.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffStatusRequest {

    /** true = grant staff access, false = revoke */
    @NotNull(message = "isStaff is required.")
    @JsonProperty("isStaff")
    private Boolean isStaff;
}

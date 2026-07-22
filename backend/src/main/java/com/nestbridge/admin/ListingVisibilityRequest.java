package com.nestbridge.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ListingVisibilityRequest {

    /** true = hide from marketplace, false = restore visibility */
    @NotNull(message = "hidden is required.")
    private Boolean hidden;
}

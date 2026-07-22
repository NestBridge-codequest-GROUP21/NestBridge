package com.nestbridge.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmailVerifiedRequest {

    /** true = mark email verified, false = clear email verified flag */
    @NotNull(message = "emailVerified is required.")
    private Boolean emailVerified;
}

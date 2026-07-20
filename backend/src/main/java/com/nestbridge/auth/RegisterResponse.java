package com.nestbridge.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {

    private String email;
    private String displayName;
    private boolean requiresEmailVerification;
    /** True when the account was saved but SendGrid (or mail config) failed. */
    private boolean emailDeliveryFailed;
}

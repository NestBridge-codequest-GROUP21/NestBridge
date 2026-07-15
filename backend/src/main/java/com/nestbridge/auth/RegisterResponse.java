package com.nestbridge.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {

    private String email;
    private String displayName;
    private boolean requiresEmailVerification;
}

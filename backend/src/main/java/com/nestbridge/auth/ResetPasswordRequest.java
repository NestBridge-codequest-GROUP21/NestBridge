package com.nestbridge.auth;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String password;
}

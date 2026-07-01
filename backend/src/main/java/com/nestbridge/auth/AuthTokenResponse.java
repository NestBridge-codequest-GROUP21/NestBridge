package com.nestbridge.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthTokenResponse {

    private String accessToken;
    private String refreshToken;
    private String userId;
    private String email;
    private String displayName;
}

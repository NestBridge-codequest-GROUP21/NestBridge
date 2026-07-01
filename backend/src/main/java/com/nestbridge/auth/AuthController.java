package com.nestbridge.auth;

import com.nestbridge.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registration successful", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", authService.refresh(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            Authentication authentication,
            @RequestBody(required = false) RefreshTokenRequest request) {
        UUID userId = (UUID) authentication.getPrincipal();
        String refresh = request != null ? request.getRefreshToken() : null;
        authService.logout(refresh, userId);
        return ResponseEntity.ok(ApiResponse.success("Logged out", null));
    }

    @PostMapping("/verify-identity")
    public ResponseEntity<ApiResponse<Void>> verifyIdentity(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        authService.verifyIdentity(userId);
        return ResponseEntity.ok(ApiResponse.success("Identity verified", null));
    }
}

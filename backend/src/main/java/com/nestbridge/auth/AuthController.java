package com.nestbridge.auth;

import com.nestbridge.common.ApiResponse;
import com.nestbridge.notification.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Account created. Check your email to verify before signing in.",
                authService.register(request)));
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

    @GetMapping(value = "/verify-email", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        try {
            emailVerificationService.verifyEmail(token);
            return ResponseEntity.ok(verificationSuccessHtml());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(verificationErrorHtml(ex.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @RequestBody ResendVerificationRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        emailVerificationService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(
                "If an unverified account exists for this email, we sent a new verification link.",
                null));
    }

    private static String verificationSuccessHtml() {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><title>Email verified</title>
                <style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1a2b3c}
                h1{color:#0d7a6f}</style></head>
                <body>
                <h1>Email verified</h1>
                <p>Your NestBridge email is confirmed. Return to the app and sign in.</p>
                </body></html>
                """;
    }

    private static String verificationErrorHtml(String message) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><title>Verification failed</title>
                <style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1a2b3c}
                h1{color:#c0392b}</style></head>
                <body>
                <h1>Verification failed</h1>
                <p>%s</p>
                <p>Open the NestBridge app and tap <strong>Resend verification email</strong>.</p>
                </body></html>
                """.formatted(escapeHtml(message));
    }

    private static String escapeHtml(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}

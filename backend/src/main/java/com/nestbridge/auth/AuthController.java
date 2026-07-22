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
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        RegisterResponse result = authService.register(request);
        String message;
        if (!result.isRequiresEmailVerification()) {
            message = "Account created. You can sign in now.";
        } else if (result.isEmailDeliveryFailed()) {
            message = "Your account was created, but we could not send the verification email. "
                    + "Use Resend verification email, or contact support if this keeps happening.";
        } else {
            message = "Your account has been created successfully. Please check your email to verify your account before signing in.";
        }
        return ResponseEntity.ok(ApiResponse.success(message, result));
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
                "Verification email sent. Check your inbox (and spam folder).",
                null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(
                "If an account exists for this email, we sent password reset instructions.",
                null));
    }

    @GetMapping(value = "/reset-password", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> resetPasswordLanding(@RequestParam(required = false) String token) {
        if (token == null || token.isBlank() || !passwordResetService.isTokenValid(token)) {
            return ResponseEntity.badRequest().body(resetPasswordErrorHtml(
                    "This reset link is invalid or has expired. Request a new one from the NestBridge app."));
        }
        return ResponseEntity.ok(resetPasswordLandingHtml(token.trim()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Password updated. You can sign in with your new password.", null));
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

    private static String resetPasswordLandingHtml(String token) {
        String safeToken = escapeHtml(token);
        String appUrl = escapeHtml("nestbridge://reset-password?token=" + token);
        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Reset password - NestBridge</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body{font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1.25rem;color:#1a2b3c;background:#f7faf9}
                    h1{color:#0d3b4c;font-size:1.5rem;margin-bottom:0.35rem}
                    p{line-height:1.55;color:#3d4f5f}
                    label{display:block;font-weight:600;margin:1rem 0 0.35rem}
                    input{width:100%;box-sizing:border-box;padding:0.75rem 0.85rem;border:1px solid #c5d0d6;border-radius:10px;font-size:1rem}
                    button{width:100%;margin-top:1.25rem;padding:0.85rem 1.25rem;background:#0d7a6f;color:#fff;border:0;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer}
                    button:disabled{opacity:0.65;cursor:not-allowed}
                    .card{background:#fff;border-radius:16px;padding:1.5rem;box-shadow:0 8px 24px rgba(13,59,76,0.08)}
                    .msg{margin-top:1rem;padding:0.75rem 0.9rem;border-radius:10px;display:none}
                    .msg.error{display:block;background:#fdecea;color:#9b1c1c}
                    .msg.ok{display:block;background:#e8f7f3;color:#0d7a6f}
                    .hint{font-size:0.9rem;margin-top:1rem}
                    a{color:#0d7a6f}
                  </style>
                </head>
                <body>
                  <div class="card">
                    <h1>Choose a new password</h1>
                    <p>Enter and confirm your new NestBridge password. You can then sign in on the app.</p>
                    <form id="reset-form" novalidate>
                      <input type="hidden" id="token" value="__RESET_TOKEN__"/>
                      <label for="password">New password</label>
                      <input id="password" name="password" type="password" autocomplete="new-password" minlength="6" required placeholder="At least 6 characters"/>
                      <label for="confirm">Confirm password</label>
                      <input id="confirm" name="confirm" type="password" autocomplete="new-password" minlength="6" required placeholder="Re-enter password"/>
                      <button id="submit" type="submit">Save new password</button>
                    </form>
                    <div id="message" class="msg" role="status"></div>
                    <p class="hint">Have the NestBridge app installed? <a href="__APP_RESET_URL__">Open reset in the app</a></p>
                  </div>
                  <script>
                    (function () {
                      var form = document.getElementById('reset-form');
                      var message = document.getElementById('message');
                      var submit = document.getElementById('submit');
                      function show(type, text) {
                        message.className = 'msg ' + type;
                        message.textContent = text;
                      }
                      form.addEventListener('submit', function (event) {
                        event.preventDefault();
                        var token = document.getElementById('token').value;
                        var password = document.getElementById('password').value;
                        var confirm = document.getElementById('confirm').value;
                        if (!password || password.length < 6) {
                          show('error', 'Password must be at least 6 characters.');
                          return;
                        }
                        if (password !== confirm) {
                          show('error', 'Passwords do not match.');
                          return;
                        }
                        submit.disabled = true;
                        show('ok', 'Saving your new password...');
                        fetch('/api/auth/reset-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                          body: JSON.stringify({ token: token, password: password })
                        }).then(function (response) {
                          return response.json().then(function (body) {
                            return { ok: response.ok, body: body };
                          }).catch(function () {
                            return { ok: response.ok, body: null };
                          });
                        }).then(function (result) {
                          if (result.ok) {
                            form.style.display = 'none';
                            show('ok', (result.body && result.body.message)
                              ? result.body.message
                              : 'Password updated. Return to the NestBridge app and sign in with your new password.');
                            return;
                          }
                          var err = (result.body && (result.body.message || result.body.error))
                            ? (result.body.message || result.body.error)
                            : 'Could not reset password. Request a new link from the app.';
                          show('error', err);
                          submit.disabled = false;
                        }).catch(function () {
                          show('error', 'Network error. Check your connection and try again.');
                          submit.disabled = false;
                        });
                      });
                    })();
                  </script>
                </body>
                </html>
                """;
        return html
                .replace("__RESET_TOKEN__", safeToken)
                .replace("__APP_RESET_URL__", appUrl);
    }

    private static String resetPasswordErrorHtml(String message) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><title>Reset failed</title>
                <style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1a2b3c}
                h1{color:#c0392b}</style></head>
                <body>
                <h1>Reset link unavailable</h1>
                <p>%s</p>
                </body></html>
                """.formatted(escapeHtml(message));
    }
}

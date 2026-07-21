package com.nestbridge.auth;

import com.nestbridge.notification.EmailDeliveryException;
import com.nestbridge.notification.EmailService;
import com.nestbridge.notification.EmailVerificationService;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;
    private final PlatformTransactionManager transactionManager;

    @Value("${jwt.refresh-expiry-ms}")
    private long refreshExpiryMs;

    @Value("${email.verification-enabled:true}")
    private boolean verificationEnabled;

    /**
     * Real inbox verification only when enabled AND SendGrid is configured.
     * Otherwise users would be stuck with no email ever arriving.
     */
    private boolean inboxVerificationActive() {
        return verificationEnabled && emailService.isConfigured();
    }

    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        var existing = userRepository.findByEmailIgnoreCase(email);
        if (existing.isPresent()) {
            User user = existing.get();
            if (inboxVerificationActive() && !user.isEmailVerified()) {
                throw new IllegalArgumentException(
                        "You already started signup with this email. Check your inbox to verify, or use Resend verification email.");
            }
            throw new IllegalArgumentException("An account with this email already exists. Try signing in.");
        }

        // Skip inbox gate when SendGrid is missing — auto-verify so signup is usable.
        boolean autoVerify = !inboxVerificationActive();
        User user = persistNewUser(request, email, autoVerify);

        if (autoVerify) {
            if (verificationEnabled && !emailService.isConfigured()) {
                log.warn(
                        "Registered {} without verification email — SENDGRID_API_KEY is not configured",
                        email);
            }
            return RegisterResponse.builder()
                    .email(user.getEmail())
                    .displayName(user.getFullName())
                    .requiresEmailVerification(false)
                    .emailDeliveryFailed(false)
                    .build();
        }

        String verifyUrl = emailVerificationService.issueVerificationLink(user);
        boolean deliveryFailed = false;
        try {
            emailVerificationService.deliverVerificationEmail(user, verifyUrl);
        } catch (EmailDeliveryException ex) {
            deliveryFailed = true;
            log.error(
                    "Verification email delivery failed for {} — verifyUrl={} cause={}",
                    email,
                    verifyUrl,
                    ex.getMessage());
        }

        return RegisterResponse.builder()
                .email(user.getEmail())
                .displayName(user.getFullName())
                .requiresEmailVerification(true)
                .emailDeliveryFailed(deliveryFailed)
                .build();
    }

    private User persistNewUser(RegisterRequest request, String email, boolean emailVerified) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        return template.execute(status -> {
            User user = User.builder()
                    .fullName(request.getFullName().trim())
                    .email(email)
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .activeExchangeStudent(true)
                    .identityVerified(false)
                    .emailVerified(emailVerified)
                    .build();
            if (emailVerified) {
                user.setEmailVerifiedAt(java.time.OffsetDateTime.now());
            }
            return userRepository.save(user);
        });
    }

    public AuthTokenResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        if (user.isSuspended()) {
            throw new IllegalArgumentException("This account has been suspended.");
        }
        if (!user.isEmailVerified()) {
            if (inboxVerificationActive()) {
                throw new EmailNotVerifiedException();
            }
            // Mail cannot be delivered — do not permanently lock the account.
            log.warn(
                    "Allowing unverified login for {} because SendGrid is not configured (or verification is off)",
                    email);
        }
        return issueTokens(user);
    }

    public AuthTokenResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (tokenBlacklistService.isBlacklisted(token) || !jwtUtil.isRefreshToken(token)) {
            throw new IllegalArgumentException("Invalid refresh token.");
        }
        var userId = jwtUtil.getUserId(token);
        String stored = tokenBlacklistService.getStoredRefreshToken(userId.toString());
        if (stored == null || !stored.equals(token)) {
            throw new IllegalArgumentException("Invalid refresh token.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.isSuspended()) {
            throw new IllegalArgumentException("This account has been suspended.");
        }
        return issueTokens(user);
    }

    public void logout(String refreshToken, java.util.UUID userId) {
        if (refreshToken != null && jwtUtil.isRefreshToken(refreshToken)) {
            tokenBlacklistService.blacklistRefreshToken(refreshToken, refreshExpiryMs);
        }
        tokenBlacklistService.removeRefreshToken(userId.toString());
    }

    @Transactional
    public void verifyIdentity(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setIdentityVerified(true);
        userRepository.save(user);
    }

    private AuthTokenResponse issueTokens(User user) {
        String access = jwtUtil.generateAccessToken(user.getUserId(), user.getEmail());
        String refresh = jwtUtil.generateRefreshToken(user.getUserId(), user.getEmail());
        tokenBlacklistService.storeRefreshToken(user.getUserId().toString(), refresh, refreshExpiryMs);
        return AuthTokenResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .userId(user.getUserId().toString())
                .email(user.getEmail())
                .displayName(user.getFullName())
                .emailVerified(user.isEmailVerified())
                .staff(user.isStaff())
                .build();
    }
}

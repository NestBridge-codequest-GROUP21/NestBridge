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

    /**
     * Historical Flyway seed hashes for the shared string {@code password}.
     * Team ops accounts must not keep signing in with that bootstrap secret.
     */
    private static final java.util.Set<String> BOOTSTRAP_PASSWORD_HASHES = java.util.Set.of(
            // V34 / common test hash for "password"
            "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            // V2 / demo *@nestbridge.app hash for "password"
            "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy");

    private static final String TEAM_PASSWORD_REQUIRED =
            "This staff account needs your own password. Use Create account with this email to set one, or Forgot password.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;
    private final PlatformTransactionManager transactionManager;
    private final AdminEmailAllowlist adminEmailAllowlist;

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
            User existingUser = existing.get();
            // Group 21 staff were pre-seeded with password "password". Allow Create
            // account to set their own NestBridge password and keep ops access.
            // Ordinary accounts still cannot be reclaimed here.
            boolean teamOps = isTeamOpsAccount(existingUser, email);
            if (teamOps) {
                return claimTeamOpsAccount(existingUser, request);
            }
            throw new IllegalArgumentException(
                    "An account with this email already exists. Try signing in, or use Forgot password.");
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
            return readyRegisterResponse(user);
        }

        String verifyUrl = emailVerificationService.issueVerificationLink(user);
        try {
            emailVerificationService.deliverVerificationEmail(user, verifyUrl);
            return RegisterResponse.builder()
                    .email(user.getEmail())
                    .displayName(user.getFullName())
                    .requiresEmailVerification(true)
                    .emailDeliveryFailed(false)
                    .build();
        } catch (EmailDeliveryException ex) {
            // Exhibition-safe: never leave a brand-new account locked with no mail.
            log.error(
                    "Verification email delivery failed for {} — auto-verifying so signup can continue. cause={}",
                    email,
                    ex.getMessage());
            user.setEmailVerified(true);
            user.setEmailVerifiedAt(java.time.OffsetDateTime.now());
            userRepository.save(user);
            return readyRegisterResponse(user);
        }
    }

    /**
     * Lets allowlisted / already-staff teammates set the password they want via
     * Create account, then sign straight into Ops (no email gate).
     */
    private RegisterResponse claimTeamOpsAccount(User user, RegisterRequest request) {
        if (user.isSuspended()) {
            throw new IllegalArgumentException("This account has been suspended.");
        }
        rejectSharedDemoPassword(request.getPassword());
        String name = request.getFullName() == null ? "" : request.getFullName().trim();
        if (!name.isEmpty()) {
            user.setFullName(name);
        }
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStaff(true);
        user.setSuspended(false);
        user.setEmailVerified(true);
        if (user.getEmailVerifiedAt() == null) {
            user.setEmailVerifiedAt(java.time.OffsetDateTime.now());
        }
        userRepository.save(user);
        log.info("Updated NestBridge password for team ops account {}", user.getEmail());
        return readyRegisterResponse(user);
    }

    private void rejectSharedDemoPassword(String rawPassword) {
        if (rawPassword != null && "password".equalsIgnoreCase(rawPassword.trim())) {
            throw new IllegalArgumentException(
                    "Choose your own password — do not use the shared demo password.");
        }
    }

    private boolean isTeamOpsAccount(User user, String email) {
        return user.isStaff() || adminEmailAllowlist.contains(email);
    }

    private boolean isBootstrapPasswordHash(String passwordHash) {
        return passwordHash != null && BOOTSTRAP_PASSWORD_HASHES.contains(passwordHash.trim());
    }

    private static RegisterResponse readyRegisterResponse(User user) {
        return RegisterResponse.builder()
                .email(user.getEmail())
                .displayName(user.getFullName())
                .requiresEmailVerification(false)
                .emailDeliveryFailed(false)
                .build();
    }

    private User persistNewUser(RegisterRequest request, String email, boolean emailVerified) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        return template.execute(status -> {
            boolean grantStaff = adminEmailAllowlist.contains(email);
            if (grantStaff) {
                rejectSharedDemoPassword(request.getPassword());
            }
            User user = User.builder()
                    .fullName(request.getFullName().trim())
                    .email(email)
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .activeExchangeStudent(true)
                    .identityVerified(false)
                    .emailVerified(emailVerified)
                    .staff(grantStaff)
                    .build();
            if (emailVerified) {
                user.setEmailVerifiedAt(java.time.OffsetDateTime.now());
            }
            User saved = userRepository.save(user);
            if (grantStaff) {
                log.info("Granted staff access to {} via allowlist", email);
            }
            return saved;
        });
    }

    public AuthTokenResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        // Team ops must not keep using the shared Flyway bootstrap password.
        if (isTeamOpsAccount(user, email) && isBootstrapPasswordHash(user.getPasswordHash())) {
            throw new IllegalArgumentException(TEAM_PASSWORD_REQUIRED);
        }
        if (user.isSuspended()) {
            throw new IllegalArgumentException("This account has been suspended.");
        }
        if (!user.isEmailVerified()) {
            boolean allowlistedStaff = adminEmailAllowlist.contains(email);
            if (inboxVerificationActive() && !allowlistedStaff) {
                throw new EmailNotVerifiedException();
            }
            // Mail cannot be delivered — do not permanently lock the account.
            // Allowlisted staff can always reach ops even if inbox verification is stuck.
            if (!user.isEmailVerified()) {
                log.warn(
                        "Allowing unverified login for {} (SendGrid off or allowlisted staff)",
                        email);
            }
        }
        // Staff is granted at registration / team claim. Also heal allowlisted
        // teammates on login so Ops stays reachable if the flag was cleared.
        if (!user.isStaff() && adminEmailAllowlist.contains(email)) {
            user.setStaff(true);
            userRepository.save(user);
            log.info("Restored staff access for allowlisted login {}", email);
        }
        return issueTokens(user);
    }

    public AuthTokenResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (tokenBlacklistService.isBlacklisted(token) || !jwtUtil.isRefreshToken(token)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED,
                    "Invalid refresh token.");
        }
        var userId = jwtUtil.getUserId(token);
        String stored = tokenBlacklistService.getStoredRefreshToken(userId.toString());
        if (stored == null || !stored.equals(token)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED,
                    "Invalid refresh token.");
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

    /**
     * Self-serve KYC is not allowed — staff force-verify (or Smile when configured).
     * Kept as a hard forbid so old clients cannot mark themselves verified.
     */
    @Transactional
    public void verifyIdentity(java.util.UUID userId) {
        throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.FORBIDDEN,
                "Identity verification requires NestBridge staff review. Use Verify now in the app.");
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
                .identityVerified(user.isIdentityVerified())
                .staff(user.isStaff())
                .notificationsEnabled(user.isNotificationsEnabled())
                .build();
    }
}

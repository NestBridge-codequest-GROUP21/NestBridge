package com.nestbridge.notification;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final int TOKEN_BYTES = 32;
    private static final long EXPIRY_HOURS = 24;
    /** Minimum seconds between verification emails for the same account. */
    private static final long RESEND_COOLDOWN_SECONDS = 60;

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<UUID, Long> lastResendEpochMs = new ConcurrentHashMap<>();

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    @Value("${email.verification-enabled:true}")
    private boolean verificationEnabled;

    /**
     * Issues a fresh verification token (invalidating unused prior ones) and emails the link.
     * Token persistence commits independently of SendGrid success so the user can resend later.
     */
    @Transactional
    public String issueVerificationLink(User user) {
        if (!verificationEnabled) {
            markVerified(user);
            return null;
        }
        if (user.isEmailVerified()) {
            return null;
        }

        tokenRepository.deleteByUserIdAndUsedAtIsNull(user.getUserId());

        String rawToken = generateRawToken();
        EmailVerificationToken token = EmailVerificationToken.builder()
                .userId(user.getUserId())
                .tokenHash(hashToken(rawToken))
                .expiresAt(OffsetDateTime.now().plusHours(EXPIRY_HOURS))
                .build();
        tokenRepository.save(token);

        return publicUrl.replaceAll("/$", "") + "/api/auth/verify-email?token=" + rawToken;
    }

    public void deliverVerificationEmail(User user, String verifyUrl) {
        if (verifyUrl == null || verifyUrl.isBlank()) {
            return;
        }
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verifyUrl);
        lastResendEpochMs.put(user.getUserId(), System.currentTimeMillis());
    }

    @Transactional
    public void sendVerificationEmail(User user) {
        String verifyUrl = issueVerificationLink(user);
        deliverVerificationEmail(user, verifyUrl);
    }

    public void resendVerificationEmail(String email) {
        String normalized = email.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new IllegalArgumentException("No account found for this email."));
        if (user.isEmailVerified()) {
            throw new IllegalStateException("This email is already verified. You can sign in.");
        }

        enforceResendCooldown(user.getUserId());

        String verifyUrl = issueVerificationLink(user);
        deliverVerificationEmail(user, verifyUrl);
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Verification token is missing.");
        }
        String tokenHash = hashToken(rawToken.trim());
        EmailVerificationToken token = tokenRepository.findByTokenHashAndUsedAtIsNull(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException(
                        "This verification link is invalid or has already been used."));

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException(
                    "This verification link has expired. Request a new one from the app.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        markVerified(user);
        token.setUsedAt(OffsetDateTime.now());
        tokenRepository.save(token);
        tokenRepository.deleteByUserIdAndUsedAtIsNull(user.getUserId());
        lastResendEpochMs.remove(user.getUserId());
    }

    private void enforceResendCooldown(UUID userId) {
        Long last = lastResendEpochMs.get(userId);
        if (last == null) {
            return;
        }
        long elapsedSec = (System.currentTimeMillis() - last) / 1000L;
        if (elapsedSec < RESEND_COOLDOWN_SECONDS) {
            long wait = RESEND_COOLDOWN_SECONDS - elapsedSec;
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait " + wait + " seconds before requesting another verification email.");
        }
    }

    private void markVerified(User user) {
        user.setEmailVerified(true);
        user.setEmailVerifiedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}

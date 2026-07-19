package com.nestbridge.auth;

import com.nestbridge.notification.EmailService;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_BYTES = 32;
    private static final long EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    @Value("${app.mobile-scheme:nestbridge}")
    private String mobileScheme;

    /**
     * Always completes without revealing whether the email exists.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        String normalized = email.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(normalized).ifPresent(this::sendResetEmail);
    }

    @Transactional(readOnly = true)
    public boolean isTokenValid(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return false;
        }
        return tokenRepository.findByTokenHashAndUsedAtIsNull(hashToken(rawToken.trim()))
                .filter(token -> token.getExpiresAt().isAfter(OffsetDateTime.now()))
                .isPresent();
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Reset token is missing.");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        String tokenHash = hashToken(rawToken.trim());
        PasswordResetToken token = tokenRepository.findByTokenHashAndUsedAtIsNull(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("This reset link is invalid or has already been used."));

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("This reset link has expired. Request a new one from the app.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsedAt(OffsetDateTime.now());
        tokenRepository.save(token);
    }

    private void sendResetEmail(User user) {
        tokenRepository.deleteByUserIdAndUsedAtIsNull(user.getUserId());

        String rawToken = generateRawToken();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken token = PasswordResetToken.builder()
                .userId(user.getUserId())
                .tokenHash(tokenHash)
                .expiresAt(OffsetDateTime.now().plusHours(EXPIRY_HOURS))
                .build();
        tokenRepository.save(token);

        String base = publicUrl.replaceAll("/$", "");
        String webUrl = base + "/api/auth/reset-password?token=" + rawToken;
        String appUrl = mobileScheme + "://reset-password?token=" + rawToken;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), webUrl, appUrl);
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

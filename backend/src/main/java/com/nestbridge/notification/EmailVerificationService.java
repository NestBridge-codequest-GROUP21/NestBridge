package com.nestbridge.notification;

import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
public class EmailVerificationService {

    private static final int TOKEN_BYTES = 32;
    private static final long EXPIRY_HOURS = 24;

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.public-url:http://localhost:8080}")
    private String publicUrl;

    @Value("${email.verification-enabled:true}")
    private boolean verificationEnabled;

    @Transactional
    public void sendVerificationEmail(User user) {
        if (!verificationEnabled) {
            markVerified(user);
            return;
        }
        if (user.isEmailVerified()) {
            return;
        }

        String rawToken = generateRawToken();
        String tokenHash = hashToken(rawToken);

        EmailVerificationToken token = EmailVerificationToken.builder()
                .userId(user.getUserId())
                .tokenHash(tokenHash)
                .expiresAt(OffsetDateTime.now().plusHours(EXPIRY_HOURS))
                .build();
        tokenRepository.save(token);

        String verifyUrl = publicUrl.replaceAll("/$", "") + "/api/auth/verify-email?token=" + rawToken;
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verifyUrl);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        String normalized = email.trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new IllegalArgumentException("No account found for this email."));
        if (user.isEmailVerified()) {
            throw new IllegalStateException("This email is already verified. You can sign in.");
        }
        sendVerificationEmail(user);
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Verification token is missing.");
        }
        String tokenHash = hashToken(rawToken.trim());
        EmailVerificationToken token = tokenRepository.findByTokenHashAndUsedAtIsNull(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("This verification link is invalid or has already been used."));

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("This verification link has expired. Request a new one from the app.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        markVerified(user);
        token.setUsedAt(OffsetDateTime.now());
        tokenRepository.save(token);
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

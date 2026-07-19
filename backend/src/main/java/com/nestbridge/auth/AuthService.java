package com.nestbridge.auth;

import com.nestbridge.notification.EmailVerificationService;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final EmailVerificationService emailVerificationService;

    @Value("${jwt.refresh-expiry-ms}")
    private long refreshExpiryMs;

    @Value("${email.verification-enabled:true}")
    private boolean verificationEnabled;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        var existing = userRepository.findByEmailIgnoreCase(email);
        if (existing.isPresent()) {
            User user = existing.get();
            if (verificationEnabled && !user.isEmailVerified()) {
                throw new IllegalArgumentException(
                        "You already started signup with this email. Check your inbox to verify, or sign in and resend the link.");
            }
            throw new IllegalArgumentException("An account with this email already exists. Try signing in.");
        }
        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .activeExchangeStudent(true)
                .identityVerified(false)
                .emailVerified(!verificationEnabled)
                .build();
        user = userRepository.save(user);

        if (verificationEnabled) {
            emailVerificationService.sendVerificationEmail(user);
            return RegisterResponse.builder()
                    .email(user.getEmail())
                    .displayName(user.getFullName())
                    .requiresEmailVerification(true)
                    .build();
        }

        return RegisterResponse.builder()
                .email(user.getEmail())
                .displayName(user.getFullName())
                .requiresEmailVerification(false)
                .build();
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
        if (verificationEnabled && !user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
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

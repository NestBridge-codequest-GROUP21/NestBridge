package com.nestbridge.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;

    @Transactional
    public void registerToken(UUID userId, String expoPushToken, String platform) {
        if (expoPushToken == null || expoPushToken.isBlank()) {
            throw new IllegalArgumentException("Push token is required.");
        }
        deviceTokenRepository.findByUserIdAndExpoPushToken(userId, expoPushToken)
                .ifPresentOrElse(
                        existing -> {
                            existing.setPlatform(platform);
                            deviceTokenRepository.save(existing);
                        },
                        () -> deviceTokenRepository.save(DeviceToken.builder()
                                .userId(userId)
                                .expoPushToken(expoPushToken.trim())
                                .platform(platform)
                                .build()));
    }
}

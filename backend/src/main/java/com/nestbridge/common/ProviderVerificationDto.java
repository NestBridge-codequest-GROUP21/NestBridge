package com.nestbridge.common;

import lombok.Builder;
import lombok.Data;

/**
 * Marketplace trust flags exposed on host/guide profiles.
 * UI must only render badges when the corresponding flag is true.
 */
@Data
@Builder
public class ProviderVerificationDto {

    /** Primary badge: Verified Host / Verified Local Guide. */
    private boolean providerVerified;
    private boolean identityVerified;
    private boolean phoneVerified;
    private boolean locationVerified;
    private boolean experienceVerified;

    public static ProviderVerificationDto forHost(
            boolean identityVerified,
            boolean phoneVerified,
            boolean locationVerified) {
        boolean providerVerified = identityVerified;
        return ProviderVerificationDto.builder()
                .providerVerified(providerVerified)
                .identityVerified(identityVerified)
                .phoneVerified(phoneVerified)
                .locationVerified(locationVerified)
                .experienceVerified(false)
                .build();
    }

    public static ProviderVerificationDto forGuide(
            boolean identityVerified,
            boolean phoneVerified,
            boolean experienceVerified) {
        boolean providerVerified = identityVerified;
        return ProviderVerificationDto.builder()
                .providerVerified(providerVerified)
                .identityVerified(identityVerified)
                .phoneVerified(phoneVerified)
                .locationVerified(false)
                .experienceVerified(experienceVerified)
                .build();
    }
}

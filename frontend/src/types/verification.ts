/**
 * Marketplace trust flags for hosts and guides.
 * UI must only render a badge when the corresponding flag is true.
 */
export interface ProviderVerification {
  /** Primary badge: Verified Host / Verified Local Guide. */
  providerVerified: boolean;
  identityVerified: boolean;
  phoneVerified: boolean;
  locationVerified: boolean;
  experienceVerified: boolean;
}

export type VerificationVariant = 'host' | 'guide';

export const EMPTY_VERIFICATION: ProviderVerification = {
  providerVerified: false,
  identityVerified: false,
  phoneVerified: false,
  locationVerified: false,
  experienceVerified: false,
};

export function normalizeVerification(
  raw?: Partial<ProviderVerification> | null,
): ProviderVerification {
  if (!raw) return { ...EMPTY_VERIFICATION };
  return {
    providerVerified: Boolean(raw.providerVerified),
    identityVerified: Boolean(raw.identityVerified),
    phoneVerified: Boolean(raw.phoneVerified),
    locationVerified: Boolean(raw.locationVerified),
    experienceVerified: Boolean(raw.experienceVerified),
  };
}

/** Demo helper — only for mock/sample data outside screen components. */
export function hostVerification(partial?: Partial<ProviderVerification>): ProviderVerification {
  const identityVerified = partial?.identityVerified ?? true;
  return normalizeVerification({
    providerVerified: identityVerified,
    identityVerified,
    phoneVerified: partial?.phoneVerified ?? identityVerified,
    locationVerified: partial?.locationVerified ?? identityVerified,
    experienceVerified: false,
  });
}

/** Demo helper — only for mock/sample data outside screen components. */
export function guideVerification(partial?: Partial<ProviderVerification>): ProviderVerification {
  const identityVerified = partial?.identityVerified ?? true;
  return normalizeVerification({
    providerVerified: identityVerified,
    identityVerified,
    phoneVerified: partial?.phoneVerified ?? identityVerified,
    locationVerified: false,
    experienceVerified: partial?.experienceVerified ?? identityVerified,
  });
}

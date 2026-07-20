import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
} from '../constants/theme';
import type {
  ProviderVerification,
  VerificationVariant,
} from '../types/verification';
import { normalizeVerification } from '../types/verification';

export interface VerificationBadgesProps {
  verification?: ProviderVerification | null;
  variant: VerificationVariant;
  /** Use light text/icons for navy hero headers. */
  onDark?: boolean;
  style?: ViewStyle;
}

type BadgeItem = {
  key: string;
  label: string;
  primary?: boolean;
};

function buildBadges(
  verification: ProviderVerification,
  variant: VerificationVariant,
): BadgeItem[] {
  const items: BadgeItem[] = [];

  if (verification.providerVerified) {
    items.push({
      key: 'provider',
      label: variant === 'host' ? 'Verified Host' : 'Verified Local Guide',
      primary: true,
    });
  }

  if (verification.identityVerified) {
    items.push({ key: 'identity', label: 'Identity verified' });
  }
  if (verification.phoneVerified) {
    items.push({ key: 'phone', label: 'Phone verified' });
  }
  if (variant === 'host' && verification.locationVerified) {
    items.push({ key: 'location', label: 'Location verified' });
  }
  if (variant === 'guide' && verification.experienceVerified) {
    items.push({ key: 'experience', label: 'Experience verified' });
  }

  return items;
}

/**
 * Marketplace trust badges driven by provider verification flags.
 * Renders nothing when no flags are true — never invents badges.
 */
export default function VerificationBadges({
  verification,
  variant,
  onDark = false,
  style,
}: VerificationBadgesProps) {
  const { colors, tints } = useTheme();
  const flags = normalizeVerification(verification);
  const badges = buildBadges(flags, variant);

  if (badges.length === 0) {
    return null;
  }

  const primary = badges.find((b) => b.primary);
  const secondary = badges.filter((b) => !b.primary);

  const checkColor = onDark ? colors.white : colors.teal;
  const primaryText = onDark ? colors.white : colors.tealDeep;
  const secondaryText = onDark ? colors.white : colors.textSecondary;
  const primaryBg = onDark ? tints.teal : tints.teal;
  const primaryBorder = onDark ? colors.white : colors.teal;

  return (
    <View
      style={[styles.root, style]}
      accessibilityRole="summary"
      accessibilityLabel={badges.map((b) => b.label).join(', ')}
    >
      {primary ? (
        <View
          style={[
            styles.primaryRow,
            {
              backgroundColor: onDark ? 'transparent' : primaryBg,
              borderColor: onDark ? colors.white : primaryBorder,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={iconSizes.sm}
            color={checkColor}
          />
          <Text style={[styles.primaryLabel, { color: primaryText }]}>
            {primary.label}
          </Text>
        </View>
      ) : null}

      {secondary.length > 0 ? (
        <View style={styles.secondaryList}>
          {secondary.map((badge) => (
            <View key={badge.key} style={styles.secondaryRow}>
              <Ionicons
                name="checkmark"
                size={iconSizes.sm}
                color={checkColor}
              />
              <Text style={[styles.secondaryLabel, { color: secondaryText }]}>
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: borderWidths.hairline,
  },
  primaryLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
  },
  secondaryList: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  secondaryLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.caption,
  },
});

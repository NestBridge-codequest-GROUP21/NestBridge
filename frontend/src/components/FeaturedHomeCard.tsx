import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Avatar from './Avatar';
import Card from './Card';
import StatusBadge from './StatusBadge';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
} from '../constants/theme';

export interface FeaturedHomeCardProps {
  sectionLabel: string;
  name: string;
  badge?: string;
  details: string;
  matchReasons?: string[];
  ctaLabel: string;
  initials?: string;
  onPress?: () => void;
}

export default function FeaturedHomeCard({
  sectionLabel,
  name,
  badge,
  details,
  matchReasons,
  ctaLabel,
  initials,
  onPress,
}: FeaturedHomeCardProps) {
  const styles = useThemedStyles(createStyles);

  const avatarText = initials ?? name.slice(0, 2).toUpperCase();

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${sectionLabel}. ${name}. ${details}`}
    >
      <Card padding="lg" elevation="card" style={styles.card}>
        <Text style={styles.sectionLabel}>{sectionLabel}</Text>

        <View style={styles.body}>
          <Avatar initials={avatarText} size="lg" style={styles.avatar} />

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {badge ? <StatusBadge label={badge} tone="info" /> : null}
            </View>
            <Text style={styles.details}>{details}</Text>
            {matchReasons && matchReasons.length > 0 ? (
              <View style={styles.reasons}>
                {matchReasons.map((reason) => (
                  <Text key={reason} style={styles.reason}>
                    {reason}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.cta}>{ctaLabel}</Text>
      </Card>
    </Pressable>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  pressable: {
    marginBottom: spacing.lg,
  },
  card: {},
  pressed: {
    opacity: 0.94,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatar: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    flexShrink: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  details: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  reasons: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  reason: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  cta: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});
}


import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
} from '../constants/theme';

export type StatusBadgeTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  style?: ViewStyle;
}

/** Compact status chip for list and booking cards. */
export default function StatusBadge({
  label,
  tone = 'neutral',
  style,
}: StatusBadgeProps) {
  const { colors, tints } = useTheme();
  const toneStyles: Record<StatusBadgeTone, { background: string; text: string }> = {
    neutral: { background: tints.navy, text: colors.textSecondary },
    success: { background: tints.teal, text: colors.success },
    warning: { background: tints.gold, text: colors.textPrimary },
    danger: { background: tints.terracotta, text: colors.danger },
    info: { background: tints.teal, text: colors.onAccent },
    accent: { background: tints.gold, text: colors.onAccent },
  };
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: toneStyle.background },
        style,
      ]}
      accessibilityRole="text"
    >
      <Text
        style={[styles.label, { color: toneStyle.text }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    flexShrink: 1,
  },
});

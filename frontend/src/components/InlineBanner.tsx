import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import AppIcon from './AppIcon';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
} from '../constants/theme';

export type InlineBannerTone = 'error' | 'success' | 'info' | 'warning';

export interface InlineBannerProps {
  message: string;
  tone?: InlineBannerTone;
  style?: ViewStyle;
}

/** Designed inline feedback for forms and partial-page messages. */
export default function InlineBanner({
  message,
  tone = 'error',
  style,
}: InlineBannerProps) {
  const { colors, tints } = useTheme();
  const toneStyles: Record<
    InlineBannerTone,
    {
      border: string;
      background: string;
      text: string;
      icon:
        | 'alert-circle-outline'
        | 'checkmark-circle-outline'
        | 'information-circle-outline'
        | 'warning-outline';
    }
  > = {
    error: {
      border: colors.danger,
      background: tints.terracotta,
      text: colors.danger,
      icon: 'alert-circle-outline',
    },
    success: {
      border: colors.success,
      background: tints.teal,
      text: colors.success,
      icon: 'checkmark-circle-outline',
    },
    info: {
      border: colors.teal,
      background: tints.teal,
      text: colors.tealDeep,
      icon: 'information-circle-outline',
    },
    warning: {
      border: colors.warning,
      background: tints.gold,
      text: colors.textPrimary,
      icon: 'warning-outline',
    },
  };
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.banner,
        {
          borderColor: toneStyle.border,
          backgroundColor: toneStyle.background,
        },
        style,
      ]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <AppIcon
        name={toneStyle.icon}
        size={fontSizes.subheading}
        color={toneStyle.text}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: toneStyle.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.body,
  },
});

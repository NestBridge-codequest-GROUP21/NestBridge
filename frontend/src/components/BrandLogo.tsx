import React from 'react';
import { Image, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useThemedStyles, type AppTheme } from '../theme';
import {
  spacing,
  borderRadius,
} from '../constants/theme';

/** Official NestBridge logo — transparent PNG (wordmark + mark). */
const logoSource = require('../../assets/logo-transparent.png');
const resolved = Image.resolveAssetSource(logoSource);
const LOGO_ASPECT =
  resolved?.width && resolved?.height
    ? resolved.height / resolved.width
    : 1;

export type BrandLogoSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<BrandLogoSize, number> = {
  sm: spacing.xl * 2.5,
  md: spacing.xl * 3.5,
  lg: spacing.xl * 5,
  xl: spacing.xl * 7,
};

export interface BrandLogoProps {
  /** Width of the logo image. Prefer size presets for consistency. */
  size?: BrandLogoSize | number;
  /**
   * Light plate behind the logo for dark/gradient surfaces so navy
   * mark strokes stay visible. Off by default on light backgrounds.
   */
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Single reusable NestBridge logo. Uses the transparent production asset
 * and preserves aspect ratio on every density.
 */
export default function BrandLogo({
  size = 'md',
  framed = false,
  style,
  accessibilityLabel = 'NestBridge logo',
}: BrandLogoProps) {
  const styles = useThemedStyles(createStyles);
  const width = typeof size === 'number' ? size : SIZE_MAP[size];
  const height = width * LOGO_ASPECT;

  const image = (
    <Image
      source={logoSource}
      style={{ width, height }}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    />
  );

  if (!framed) {
    return <View style={[styles.plain, style]}>{image}</View>;
  }

  return (
    <View style={[styles.frame, { width: width + spacing.md * 2 }, style]}>
      {image}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    plain: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    frame: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.navy,
      shadowOffset: { width: 0, height: spacing.sm },
      shadowOpacity: 0.18,
      shadowRadius: spacing.md,
      elevation: spacing.sm,
    },
  });
}

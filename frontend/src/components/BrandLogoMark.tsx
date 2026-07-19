import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';

const iconImage = require('../../assets/logo-icon.png');
const iconAsset = Image.resolveAssetSource(iconImage);
const iconAspectRatio =
  iconAsset?.width && iconAsset?.height
    ? iconAsset.height / iconAsset.width
    : 1;

const LOGO_MARK_SIZE = spacing.xl * 4;

export interface BrandLogoMarkProps {
  size?: number;
  accessibilityLabel?: string;
}

export default function BrandLogoMark({
  size = LOGO_MARK_SIZE,
  accessibilityLabel = 'NestBridge logo',
}: BrandLogoMarkProps) {
  const innerSize = size - spacing.md * 2;
  const innerHeight = innerSize * iconAspectRatio;

  return (
    <View style={[styles.logoMark, { width: size, height: size }]}>
      <Image
        source={iconImage}
        style={{ width: innerSize, height: innerHeight }}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoMark: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.25,
    shadowRadius: spacing.lg,
    elevation: spacing.sm,
  },
});

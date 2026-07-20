import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  borderRadius,
  spacing,
  layout,
} from '../constants/theme';

export interface SosCircleButtonProps {
  onPress?: () => void;
}

/**
 * Raised circular SOS control. Anchored inside the bottom tab bar (or a
 * stack-screen bottom bar) — never floats over scrollable content.
 */
export default function SosCircleButton({
 onPress }: SosCircleButtonProps) {
  const styles = useThemedStyles(createStyles);

  if (!onPress) {
    return null;
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS"
    >
      <Text style={styles.label}>SOS</Text>
    </Pressable>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
  button: {
    width: layout.sosButtonSize,
    height: layout.sosButtonSize,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: spacing.xs,
    borderColor: colors.white,
    ...shadows.floating,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
}


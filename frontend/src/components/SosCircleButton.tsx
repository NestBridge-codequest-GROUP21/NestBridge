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
import { feedbackUrgent } from '../services/appFeedback';

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
      onPress={() => {
        feedbackUrgent();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS"
    >
      <Text style={styles.label}>SOS</Text>
    </Pressable>
  );
}

function createStyles({ colors, shadows, chrome }: AppTheme) {
  return StyleSheet.create({
  button: {
    width: layout.sosButtonSize,
    height: layout.sosButtonSize,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: chrome.sosBorderWidth,
    borderColor: colors.sosBorder,
    ...shadows.floating,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.onPrimary,
    letterSpacing: 0.5,
  },
});
}


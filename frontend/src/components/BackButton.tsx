import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import AppIcon from './AppIcon';
import { colors, spacing, iconSizes, touchTarget } from '../constants/theme';

export interface BackButtonProps {
  onPress?: () => void;
  /** Icon / pressable color. Default navy text for light screens. */
  color?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/** Consistent 44×44 back control — chevron icon, never text arrows. */
export default function BackButton({
  onPress,
  color = colors.textPrimary,
  accessibilityLabel = 'Go back',
  style,
}: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={spacing.xs}
    >
      <AppIcon name="chevron-back" size={iconSizes.lg} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

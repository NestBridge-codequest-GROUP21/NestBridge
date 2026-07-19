import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../constants/theme';

export interface SecondaryButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  buttonDisabled: {
    borderColor: colors.border,
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.9,
    backgroundColor: colors.warmCream,
  },
  label: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  labelDisabled: {
    color: colors.textTertiary,
  },
});

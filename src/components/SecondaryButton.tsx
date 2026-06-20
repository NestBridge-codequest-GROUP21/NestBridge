import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../constants/theme';

export interface SecondaryButtonProps {
  label: string;
  onPress?: () => void;
}

export default function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
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
  buttonPressed: {
    opacity: 0.9,
    backgroundColor: colors.warmCream,
  },
  label: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});

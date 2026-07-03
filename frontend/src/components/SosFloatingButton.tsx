import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

export interface SosFloatingButtonProps {
  onPress?: () => void;
  bottomOffset?: number;
}

export default function SosFloatingButton({
  onPress,
  bottomOffset = spacing.md,
}: SosFloatingButtonProps) {
  const insets = useSafeAreaInsets();

  if (!onPress) {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: Math.max(insets.bottom, spacing.sm) + bottomOffset },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS"
      >
        <Text style={styles.icon}>🆘</Text>
        <Text style={styles.label}>SOS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    gap: spacing.xs,
    shadowColor: colors.navy,
    shadowOpacity: 0.18,
    shadowRadius: spacing.sm,
    shadowOffset: { width: 0, height: spacing.xs },
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  icon: {
    fontSize: fontSizes.body,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.4,
  },
});

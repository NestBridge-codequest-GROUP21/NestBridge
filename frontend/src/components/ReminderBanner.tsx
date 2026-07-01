import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  spacing,
  borderRadius,
  lineHeights,
} from '../constants/theme';

export interface ReminderBannerProps {
  icon?: string;
  message: string;
  onPress?: () => void;
}

export default function ReminderBanner({
  icon = '🔔',
  message,
  onPress,
}: ReminderBannerProps) {
  const content = (
    <>
      <Text style={styles.icon} accessibilityElementsHidden>
        {icon}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={message}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={styles.banner} accessibilityRole="text">
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.94,
  },
  icon: {
    fontSize: fontSizes.subheading,
  },
  message: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
});

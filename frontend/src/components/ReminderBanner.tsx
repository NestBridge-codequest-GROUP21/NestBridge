import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AppIcon, { type IoniconName } from './AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  spacing,
  borderRadius,
  lineHeights,
  iconSizes,
} from '../constants/theme';

export interface ReminderBannerProps {
  /** Legacy emoji glyph key (mapped via AppIcon). Prefer iconName. */
  icon?: string;
  iconName?: IoniconName;
  message: string;
  onPress?: () => void;
}

export default function ReminderBanner({
  icon,
  iconName = 'notifications-outline',
  message,
  onPress,
}: ReminderBannerProps) {
  const content = (
    <>
      <AppIcon
        name={icon ? undefined : iconName}
        glyph={icon}
        size={iconSizes.md}
        color={colors.warning}
      />
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

import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import AppIcon, { type IoniconName } from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  iconSizes,
  lineHeights,
} from '../constants/theme';

export interface SecondaryButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconName?: IoniconName;
  style?: ViewStyle;
}

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  iconName,
  style,
}: SecondaryButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.teal} />
      ) : (
        <View style={styles.content}>
          {iconName ? (
            <AppIcon
              name={iconName}
              size={iconSizes.md}
              color={isDisabled ? colors.textTertiary : colors.teal}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  button: {
    borderWidth: borderWidths.strong,
    borderColor: colors.teal,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: controlHeights.lg,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.teal,
  },
  labelDisabled: {
    color: colors.textTertiary,
  },
});
}


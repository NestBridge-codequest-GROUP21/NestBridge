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

export type SecondaryButtonTone = 'default' | 'danger' | 'success';

export interface SecondaryButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconName?: IoniconName;
  /** default = teal; danger = red (sign out / decline / no); success = green (yes / confirm). */
  tone?: SecondaryButtonTone;
  style?: ViewStyle;
}

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  iconName,
  tone = 'default',
  style,
}: SecondaryButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const accent =
    tone === 'danger'
      ? colors.danger
      : tone === 'success'
        ? colors.success
        : colors.teal;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        tone === 'danger' && styles.buttonDanger,
        tone === 'success' && styles.buttonSuccess,
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
        <ActivityIndicator color={isDisabled ? colors.textTertiary : accent} />
      ) : (
        <View style={styles.content}>
          {iconName ? (
            <AppIcon
              name={iconName}
              size={iconSizes.md}
              color={isDisabled ? colors.textTertiary : accent}
              style={styles.icon}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              tone === 'danger' && styles.labelDanger,
              tone === 'success' && styles.labelSuccess,
              isDisabled && styles.labelDisabled,
            ]}
            numberOfLines={2}
          >
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
      backgroundColor: colors.surface,
    },
    buttonDanger: {
      borderColor: colors.danger,
    },
    buttonSuccess: {
      borderColor: colors.success,
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
      maxWidth: '100%',
      gap: spacing.sm,
    },
    icon: {
      flexShrink: 0,
    },
    label: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.subheading,
      color: colors.teal,
      flexShrink: 1,
      textAlign: 'center',
    },
    labelDanger: {
      color: colors.danger,
    },
    labelSuccess: {
      color: colors.success,
    },
    labelDisabled: {
      color: colors.textTertiary,
    },
  });
}

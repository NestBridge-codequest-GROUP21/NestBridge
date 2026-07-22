import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import AppIcon from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
  iconSizes,
} from '../constants/theme';

export interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

/** Shared checkbox row for auth and settings forms. */
export default function CheckboxRow({
  label,
  checked,
  onPress,
  style,
}: CheckboxRowProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <AppIcon name="checkmark" size={iconSizes.sm} color={colors.onPrimary} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
  },
  checkbox: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidths.strong,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  label: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
});
}


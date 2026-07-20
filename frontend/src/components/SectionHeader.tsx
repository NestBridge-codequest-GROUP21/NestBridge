import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  touchTarget,
} from '../constants/theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

/** Consistent section title row used above lists and card groups. */
export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  style,
}: SectionHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.row, style]}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={spacing.sm}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  action: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    flexShrink: 0,
  },
  actionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});
}


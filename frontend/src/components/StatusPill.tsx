import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  iconSizes,
  lineHeights,
} from '../constants/theme';

export interface StatusPillProps {
  icon?: string;
  label: string;
}

export default function StatusPill({
 icon, label }: StatusPillProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <View style={styles.pill} accessibilityRole="text">
      {icon ? (
        <AppIcon glyph={icon} size={iconSizes.sm} color={colors.onPrimary} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: colors.navyMid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  icon: {
    fontSize: fontSizes.body,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.onPrimary,
  },
});
}


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

export interface StatusPillProps {
  icon?: string;
  label: string;
}

export default function StatusPill({ icon, label }: StatusPillProps) {
  return (
    <View style={styles.pill} accessibilityRole="text">
      {icon ? (
        <AppIcon glyph={icon} size={fontSizes.body} color={colors.white} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});

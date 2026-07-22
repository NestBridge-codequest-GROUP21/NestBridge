import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  spacing,
  lineHeights,
} from '../constants/theme';

export interface FeatureHighlight {
  icon: string;
  label: string;
}

export interface FeatureHighlightRowProps {
  items: FeatureHighlight[];
}

export default function FeatureHighlightRow({
 items }: FeatureHighlightRowProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <AppIcon
            glyph={item.icon}
            size={fontSizes.subheading}
            color={colors.onPrimary}
            style={styles.icon}
          />
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  icon: {
    fontSize: fontSizes.subheading,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.onPrimary,
    opacity: 0.88,
    textAlign: 'center',
    width: '100%',
  },
});
}


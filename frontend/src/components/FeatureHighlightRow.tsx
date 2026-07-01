import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  spacing,
} from '../constants/theme';

export interface FeatureHighlight {
  icon: string;
  label: string;
}

export interface FeatureHighlightRowProps {
  items: FeatureHighlight[];
}

export default function FeatureHighlightRow({ items }: FeatureHighlightRowProps) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    minWidth: 44,
  },
  icon: {
    fontSize: fontSizes.subheading,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.white,
    opacity: 0.88,
    textAlign: 'center',
  },
});

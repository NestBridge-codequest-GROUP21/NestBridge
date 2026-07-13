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
  layout,
} from '../constants/theme';

export interface RecentActivityItem {
  id: string;
  icon?: string;
  title: string;
  timestamp: string;
}

export interface RecentActivityListProps {
  title?: string;
  items: RecentActivityItem[];
}

export default function RecentActivityList({
  title = 'Recent Activity',
  items,
}: RecentActivityListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[styles.row, index < items.length - 1 && styles.rowBorder]}
        >
          <View style={styles.iconWrap}>
            <AppIcon glyph={item.icon} size={fontSizes.subheading} color={colors.tealDeep} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fontSizes.body,
  },
  textBlock: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
});

import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import SectionHeader from './SectionHeader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  iconSizes,
  avatarSizes,
  lineHeights,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <SectionHeader title={title} />
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[styles.row, index < items.length - 1 && styles.rowBorder]}
        >
          <View style={styles.iconWrap}>
            <AppIcon
              glyph={item.icon}
              size={iconSizes.md}
              color={colors.tealDeep}
            />
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

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: avatarSizes.md,
    height: avatarSizes.md,
    borderRadius: borderRadius.md,
    backgroundColor: tints.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
});
}


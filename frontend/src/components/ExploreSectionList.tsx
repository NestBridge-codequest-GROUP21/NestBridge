import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';
import AppIcon from './AppIcon';
import Card from './Card';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  iconSizes,
  touchTarget,
  lineHeights,
} from '../constants/theme';

export interface ExploreSectionListProps {
  sections: ExploreSectionItem[];
  /** Vertical rows (default) or 2-column grid for short shortcut sets. */
  variant?: 'list' | 'grid';
  onSectionPress?: (sectionId: string) => void;
}

export default function ExploreSectionList({
  sections,
  variant = 'list',
  onSectionPress,
}: ExploreSectionListProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  if (sections.length === 0) {
    return null;
  }

  if (variant === 'grid') {
    return (
      <View style={styles.grid} accessibilityRole="list">
        {sections.map((section) => (
          <Pressable
            key={section.id}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.pressed,
            ]}
            onPress={() => onSectionPress?.(section.id)}
            accessibilityRole="button"
            accessibilityLabel={section.title}
          >
            <Card padding="md" elevation="card" style={styles.gridCard}>
              {section.icon ? (
                <View style={styles.gridIconTile}>
                  <AppIcon
                    glyph={section.icon}
                    size={iconSizes.lg}
                    color={colors.tealDeep}
                  />
                </View>
              ) : null}
              <Text style={styles.gridTitle} numberOfLines={3}>
                {section.title}
              </Text>
              <Text style={styles.gridSubtitle} numberOfLines={3}>
                {section.subtitle}
              </Text>
            </Card>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.list} accessibilityRole="list">
      {sections.map((section) => (
        <Pressable
          key={section.id}
          style={({ pressed }) => [styles.listPress, pressed && styles.pressed]}
          onPress={() => onSectionPress?.(section.id)}
          accessibilityRole="button"
          accessibilityLabel={section.title}
        >
          <Card padding="md" elevation="card" style={styles.listCard}>
            {section.icon ? (
              <View style={styles.listIconTile}>
                <AppIcon
                  glyph={section.icon}
                  size={iconSizes.lg}
                  color={colors.tealDeep}
                />
              </View>
            ) : null}
            <View style={styles.listText}>
              <Text style={styles.listTitle} numberOfLines={3}>
                {section.title}
              </Text>
              <Text style={styles.listSubtitle} numberOfLines={3}>
                {section.subtitle}
              </Text>
            </View>
            <AppIcon
              name="chevron-forward"
              size={iconSizes.md}
              color={colors.teal}
            />
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  listPress: {
    minHeight: touchTarget,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconTile: {
    width: layout.iconTileSize,
    height: layout.iconTileSize,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  listText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  listTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  listSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  gridCard: {
    minHeight: touchTarget * 2,
  },
  gridIconTile: {
    width: layout.iconTileSize,
    height: layout.iconTileSize,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  gridTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  gridSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.94,
  },
});
}


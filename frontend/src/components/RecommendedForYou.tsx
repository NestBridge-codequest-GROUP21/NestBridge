import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Card from './Card';
import SectionHeader from './SectionHeader';
import AppIcon from './AppIcon';
import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  layout,
} from '../constants/theme';
import type { EmptyStateContent } from '../data/appCopy';
import EmptyState, { emptyStateFromContent } from './EmptyState';
import type {
  RecommendationItem,
  RecommendationSection,
} from '../types/recommendations';

export interface RecommendedForYouProps {
  headline?: string;
  sections: RecommendationSection[];
  emptyState?: EmptyStateContent;
  onEmptyPrimaryAction?: () => void;
  onItemPress?: (item: RecommendationItem) => void;
}

/** Destination-aware recommendation blocks — list and grid layouts, no carousel. */
export default function RecommendedForYou({
  headline = 'Recommended for you',
  sections,
  emptyState,
  onEmptyPrimaryAction,
  onItemPress,
}: RecommendedForYouProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (!sections.length) {
    if (!emptyState) {
      return null;
    }
    return (
      <View style={styles.root} accessibilityRole="summary">
        <SectionHeader title={headline} style={styles.headline} />
        <EmptyState {...emptyStateFromContent(emptyState, onEmptyPrimaryAction)} />
      </View>
    );
  }

  return (
    <View style={styles.root} accessibilityRole="summary">
      <SectionHeader title={headline} style={styles.headline} />
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.layout === 'grid' ? (
            <View style={styles.grid}>
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.gridCard,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onItemPress?.(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <View style={styles.gridIcon}>
                    <AppIcon
                      glyph={item.icon ?? '📍'}
                      size={iconSizes.md}
                      color={colors.tealDeep}
                    />
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Card padding="none" elevation="card" style={styles.listCard}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.listRow,
                    index > 0 && styles.listRowBorder,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onItemPress?.(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <View style={styles.listIcon}>
                    <AppIcon
                      glyph={item.icon ?? '📍'}
                      size={iconSizes.md}
                      color={colors.tealDeep}
                    />
                  </View>
                  <View style={styles.listText}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.listSubtitle} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                    {item.reason ? (
                      <Text style={styles.listReason} numberOfLines={1}>
                        {item.reason}
                      </Text>
                    ) : null}
                  </View>
                  {item.priceLabel ? (
                    <Text style={styles.price}>{item.priceLabel}</Text>
                  ) : (
                    <AppIcon
                      name="chevron-forward"
                      size={iconSizes.md}
                      color={colors.textTertiary}
                    />
                  )}
                </Pressable>
              ))}
            </Card>
          )}
        </View>
      ))}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      marginBottom: spacing.lg,
    },
    headline: {
      marginBottom: spacing.sm,
    },
    section: {
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    listCard: {
      overflow: 'hidden',
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget + spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    listRowBorder: {
      borderTopWidth: borderWidths.hairline,
      borderTopColor: colors.border,
    },
    listIcon: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listText: {
      flex: 1,
    },
    listTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    listSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.caption,
    },
    listReason: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.primaryAction,
      marginTop: spacing.xs,
    },
    price: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.tealDeep,
      maxWidth: 88,
      textAlign: 'right',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    gridCard: {
      width: '48%',
      flexGrow: 1,
      maxWidth: '48%',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      padding: spacing.md,
      minHeight: layout.iconTileSize + spacing.xl,
    },
    gridIcon: {
      width: iconSizes.xl,
      height: iconSizes.xl,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    gridTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    gridSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textSecondary,
      lineHeight: lineHeights.micro,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}

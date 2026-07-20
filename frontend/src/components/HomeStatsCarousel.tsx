import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import SectionHeader from './SectionHeader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  lineHeights,
  touchTarget,
} from '../constants/theme';

export interface HomeStatItem {
  id: string;
  value: string;
  label: string;
  subtitle?: string;
}

export interface HomeStatsCarouselProps {
  title: string;
  items: HomeStatItem[];
  onItemPress?: (itemId: string) => void;
}

/** Compact KPI tiles in a wrapping 2-column grid (not a swipe carousel). */
export default function HomeStatsCarousel({
  title,
  items,
  onItemPress,
}: HomeStatsCarouselProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <SectionHeader title={title} />
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.cardOuter,
              pressed && styles.pressed,
            ]}
            onPress={() => onItemPress?.(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.value} ${item.label}`}
          >
            <View style={styles.card}>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.label}</Text>
              {item.subtitle ? (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cardOuter: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  card: {
    minHeight: touchTarget * 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: layout.cardPadding,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    justifyContent: 'center',
    ...shadows.card,
  },
  pressed: {
    opacity: 0.94,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.heading,
    color: colors.tealDeep,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
});
}


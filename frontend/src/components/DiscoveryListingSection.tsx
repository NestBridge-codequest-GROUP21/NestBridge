import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Card from './Card';
import Avatar from './Avatar';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  layout,
  touchTarget,
} from '../constants/theme';

export interface DiscoveryListingItem {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  initials: string;
  matchPercentage?: number;
}

export interface DiscoveryEmptyState {
  title: string;
  body: string;
}

export interface DiscoveryListingSectionProps {
  title: string;
  items: DiscoveryListingItem[];
  showMatchScores?: boolean;
  emptyState?: DiscoveryEmptyState;
  onItemPress?: (itemId: string) => void;
}

export default function DiscoveryListingSection({
  title,
  items,
  showMatchScores = false,
  emptyState,
  onItemPress,
}: DiscoveryListingSectionProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <SectionHeader title={title} />

      {items.length === 0 && emptyState ? (
        <EmptyState
          title={emptyState.title}
          body={emptyState.body}
          iconName="home-outline"
          style={styles.empty}
        />
      ) : null}

      {items.slice(0, 2).map((item, index) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            index < Math.min(items.length, 2) - 1 && styles.cardSpacing,
            pressed && styles.pressed,
          ]}
          onPress={() => onItemPress?.(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          <Card style={styles.card}>
            <Avatar initials={item.initials} size="md" />
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
              <Text style={styles.price} numberOfLines={2}>
                {item.priceLabel}
              </Text>
            </View>
            {showMatchScores && item.matchPercentage != null ? (
              <Text style={styles.match}>{item.matchPercentage}%</Text>
            ) : null}
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  empty: {
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
    gap: spacing.md,
  },
  cardSpacing: {
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.95,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  match: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});
}


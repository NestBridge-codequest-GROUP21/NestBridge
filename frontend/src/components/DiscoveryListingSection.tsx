import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
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
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{title}</Text>

      {items.length === 0 && emptyState ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{emptyState.title}</Text>
          <Text style={styles.emptyBody}>{emptyState.body}</Text>
        </View>
      ) : null}

      {items.slice(0, 2).map((item, index) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            styles.card,
            index < Math.min(items.length, 2) - 1 && styles.cardSpacing,
            pressed && styles.pressed,
          ]}
          onPress={() => onItemPress?.(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              {item.priceLabel}
            </Text>
          </View>
          {showMatchScores && item.matchPercentage != null ? (
            <Text style={styles.match}>{item.matchPercentage}%</Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  heading: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSpacing: {
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.95,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.white,
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
    marginLeft: spacing.sm,
  },
});

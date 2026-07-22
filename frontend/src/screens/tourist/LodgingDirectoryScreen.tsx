import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  layout,
} from '../../constants/theme';
import type { LodgingListing, LodgingCategoryFilter } from '../../types/lodging';
import { lodgingCategoryLabel } from '../../data/lodgingDirectoryMock';
import { emptyStates } from '../../data/appCopy';

export interface LodgingDirectoryScreenProps {
  cityLabel: string;
  listings: LodgingListing[];
  activeFilter: LodgingCategoryFilter;
  savedCount: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  onFilterChange?: (filter: LodgingCategoryFilter) => void;
  onListingPress?: (listingId: string) => void;
  onBack?: () => void;
}

const FILTERS: { id: LodgingCategoryFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'HOTEL', label: 'Hotels' },
  { id: 'GUESTHOUSE', label: 'Guesthouses' },
  { id: 'PARTNER', label: 'Partners' },
];

function filterListings(
  listings: LodgingListing[],
  filter: LodgingCategoryFilter,
): LodgingListing[] {
  if (filter === 'ALL') return listings;
  return listings.filter((l) => l.category === filter);
}

export default function LodgingDirectoryScreen({
  cityLabel,
  listings,
  activeFilter,
  savedCount,
  isLoading = false,
  errorMessage,
  onFilterChange,
  onListingPress,
  onBack,
}: LodgingDirectoryScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const filterActive = activeFilter !== 'ALL';
  const empty =
    listings.length === 0
      ? emptyStates.lodgingDirectory(cityLabel)
      : emptyStates.lodgingDirectoryFiltered(cityLabel);

  const filtered = filterListings(listings, activeFilter);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Find lodging"
        subtitle={`Hotels and partners in ${cityLabel}`}
        compact
        onBack={onBack}
      />

      <ScreenScroll>
        <InlineBanner
          tone="info"
          message="Booking finishes with the hotel or partner — NestBridge helps you find and contact options in Ghana."
        />

        <View style={styles.filterBar}>
          {FILTERS.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <Pressable
                key={filter.id}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => onFilterChange?.(filter.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Filter ${filter.label}`}
              >
                <Text
                  style={[styles.filterLabel, isActive && styles.filterLabelActive]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {savedCount > 0 ? (
          <Text style={styles.savedHint}>{savedCount} saved to My contacts</Text>
        ) : null}

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading ? (
          <>
            <SkeletonLoader style={styles.loader} />
            <SkeletonLoader style={styles.loader} />
          </>
        ) : null}

        {!isLoading && filtered.length === 0 && !errorMessage ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={
              filterActive ? empty.primaryActionLabel : undefined
            }
            onPrimaryAction={
              filterActive ? () => onFilterChange?.('ALL') : undefined
            }
          />
        ) : null}

        {filtered.map((listing, index) => {
          const isLast = index === filtered.length - 1;
          return (
            <Pressable
              key={listing.id}
              style={({ pressed }) => [
                !isLast && styles.cardSpacing,
                pressed && styles.pressed,
              ]}
              onPress={() => onListingPress?.(listing.id)}
              accessibilityRole="button"
              accessibilityLabel={listing.name}
            >
              <Card padding="lg" elevation="card" style={styles.card}>
                <Avatar
                  initials={listing.name.slice(0, 2)}
                  size="lg"
                  style={styles.avatar}
                />
                <View style={styles.body}>
                  <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {listing.name}
                    </Text>
                    <View style={styles.ratingRow}>
                      <AppIcon
                        name="star"
                        size={iconSizes.sm}
                        color={colors.warning}
                      />
                      <Text style={styles.rating}>{listing.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.category}>
                    {lodgingCategoryLabel(listing.category)} · {listing.area}
                  </Text>
                  <Text style={styles.price}>{listing.priceHint}</Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={iconSizes.md}
                  color={colors.teal}
                />
              </Card>
            </Pressable>
          );
        })}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidths.strong,
    borderBottomColor: colors.background,
    marginBottom: -borderWidths.hairline,
  },
  filterTabActive: {
    borderBottomColor: colors.teal,
  },
  filterLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  filterLabelActive: {
    fontFamily: fontFamilies.semibold,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
  savedHint: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.94,
  },
  avatar: {
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.warning,
  },
  category: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
    marginBottom: spacing.sm,
  },
  price: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.onAccent,
  },
  loader: {
    marginBottom: spacing.md,
  },
});
}


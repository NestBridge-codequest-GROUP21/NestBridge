import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
  tints,
} from '../../constants/theme';
import type { LodgingListing, LodgingCategoryFilter } from '../../types/lodging';
import { lodgingCategoryLabel } from '../../data/lodgingDirectoryMock';

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
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}

        {!isLoading && filtered.length === 0 && !errorMessage ? (
          <EmptyState
            title="No lodging in this filter"
            body={`Try another category, or widen your search around ${cityLabel}.`}
            tip="Partner guesthouses often sit near universities and business districts."
            iconName="bed-outline"
          />
        ) : null}

        {filtered.map((listing, index) => {
          const isLast = index === filtered.length - 1;
          return (
            <Pressable
              key={listing.id}
              style={({ pressed }) => [
                styles.card,
                !isLast && styles.cardSpacing,
                pressed && styles.pressed,
              ]}
              onPress={() => onListingPress?.(listing.id)}
              accessibilityRole="button"
              accessibilityLabel={listing.name}
            >
              <View style={styles.iconWrap}>
                <Text style={styles.iconInitials}>
                  {listing.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.body}>
                <View style={styles.topRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {listing.name}
                  </Text>
                  <View style={styles.ratingRow}>
                    <AppIcon name="star" size={fontSizes.caption} color={colors.warning} />
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
                size={fontSizes.subheading}
                color={colors.teal}
              />
            </Pressable>
          );
        })}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.background,
    marginBottom: -1,
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
    fontFamily: fontFamilies.bold,
    color: colors.teal,
    fontWeight: fontWeights.bold,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.94,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconInitials: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
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
    color: colors.tealDeep,
  },
  loader: {
    marginVertical: spacing.md,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
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
  const insets = useSafeAreaInsets();
  const filtered = filterListings(listings, activeFilter);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Find lodging</Text>
        <Text style={styles.headerSubtitle}>
          Hotels and partners in {cityLabel}
        </Text>
      </LinearGradient>

      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>ℹ️</Text>
        <Text style={styles.bannerText}>
          You will complete booking outside NestBridge. We help you find and
          contact options.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <Pressable
              key={filter.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => onFilterChange?.(filter.id)}
            >
              <Text
                style={[styles.filterLabel, isActive && styles.filterLabelActive]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {savedCount > 0 ? (
        <Text style={styles.savedHint}>{savedCount} saved to My contacts</Text>
      ) : null}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {isLoading ? (
        <ActivityIndicator color={colors.teal} style={styles.loader} />
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
                  <Text style={styles.rating}>★ {listing.rating}</Text>
                </View>
                <Text style={styles.category}>
                  {lodgingCategoryLabel(listing.category)} · {listing.area}
                </Text>
                <Text style={styles.price}>{listing.priceHint}</Text>
              </View>
              <Text style={styles.listAction}>View</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warmCream,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerIcon: {
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  bannerText: {
    flex: 1,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterLabel: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  filterLabelActive: {
    color: colors.white,
  },
  savedHint: {
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconInitials: {
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
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  rating: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.warning,
  },
  category: {
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  listAction: {
    fontSize: fontSizes.heading,
    color: colors.teal,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: spacing.sm,
  },
  loader: {
    marginVertical: spacing.md,
  },
});

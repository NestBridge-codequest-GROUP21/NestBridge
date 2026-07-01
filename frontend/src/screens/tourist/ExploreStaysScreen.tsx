import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import type { StayListing } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

export interface ExploreStaysScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  listings: StayListing[];
  onBookPress?: (listingId: string) => void;
  onFilterPress?: () => void;
  onBack?: () => void;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Text
          key={`star-${index}`}
          style={[styles.star, index < rating ? styles.starFilled : styles.starEmpty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function StayCard({
  listing,
  onBookPress,
}: {
  listing: StayListing;
  onBookPress?: () => void;
}) {
  return (
    <View style={styles.stayCard}>
      <View style={styles.imageCarousel}>
        <View style={styles.mainImage}>
          <Text style={styles.imageEmoji}>{listing.imageEmoji}</Text>
        </View>
        <View style={styles.thumbnailRow}>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailEmoji}>{listing.imageEmoji}</Text>
          </View>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailEmoji}>🛋️</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        {listing.verifiedHost ? (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified Host</Text>
          </View>
        ) : null}

        <Text style={styles.stayTitle}>{listing.title}</Text>
        <Text style={styles.stayLocation}>{listing.location}</Text>

        <StarRow rating={listing.rating} />

        <View style={styles.amenityRow}>
          {listing.amenities.map((amenity) => (
            <View key={amenity} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{listing.pricePerNight}</Text>
          <PrimaryButton label="Book Now" onPress={onBookPress} style={styles.bookButton} />
        </View>
      </View>
    </View>
  );
}

export default function ExploreStaysScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  listings,
  onBookPress,
  onFilterPress,
  onBack,
}: ExploreStaysScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Explore Stays</Text>
          <Pressable
            onPress={onFilterPress}
            style={styles.filterButton}
            accessibilityRole="button"
            accessibilityLabel="Filter listings"
          >
            <Text style={styles.filterIcon}>⚙</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {listings.map((listing) => (
            <StayCard
              key={listing.id}
              listing={listing}
              onBookPress={() => onBookPress?.(listing.id)}
            />
          ))}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  filterButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: fontSizes.heading,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.lg,
  },
  stayCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageCarousel: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  mainImage: {
    flex: 1,
    height: 120,
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 48,
  },
  thumbnailRow: {
    gap: spacing.sm,
  },
  thumbnail: {
    width: 56,
    height: 56,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: {
    fontSize: fontSizes.heading,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  verifiedText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.white,
  },
  stayTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.textPrimary,
  },
  stayLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  starRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  star: {
    fontSize: fontSizes.body,
  },
  starFilled: {
    color: colors.warning,
  },
  starEmpty: {
    color: colors.border,
  },
  amenityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  amenityChip: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  amenityText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priceText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  bookButton: {
    paddingHorizontal: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
});

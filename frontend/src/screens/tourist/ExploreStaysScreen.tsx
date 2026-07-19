import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import AppIcon from '../../components/AppIcon';
import type { StayListing } from '../../data/featureScreensMock';
import {
  colors,
  tints,
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
        <AppIcon
          key={`star-${index}`}
          name={index < rating ? 'star' : 'star-outline'}
          size={fontSizes.body}
          color={index < rating ? colors.warning : colors.border}
        />
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
      <View style={styles.imageTile}>
        <AppIcon glyph={listing.imageEmoji} size={44} color={colors.tealDeep} />
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
            <AppIcon name="options-outline" size={fontSizes.heading} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {listings.map((listing) => (
            <StayCard
              key={listing.id}
              listing={listing}
              onBookPress={() => onBookPress?.(listing.id)}
            />
          ))}
        </ScrollView>
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
  list: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  stayCard: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageTile: {
    height: 120,
    margin: spacing.sm,
    backgroundColor: tints.teal,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
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

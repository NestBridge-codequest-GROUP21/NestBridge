import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SectionHeader from '../../components/SectionHeader';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import PrimaryButton from '../../components/PrimaryButton';
import AppIcon from '../../components/AppIcon';
import type { StayListing } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  iconSizes,
  touchTarget,
  controlHeights,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <AppIcon
          key={`star-${index}`}
          name={index < rating ? 'star' : 'star-outline'}
          size={iconSizes.sm}
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Card padding="none" elevation="card" style={styles.stayCard}>
      <View style={styles.imageTile}>
        <AppIcon
          glyph={listing.imageEmoji}
          size={iconSizes.xl}
          color={colors.tealDeep}
        />
      </View>

      <View style={styles.cardBody}>
        {listing.verifiedHost ? (
          <StatusBadge label="Verified Host" tone="success" />
        ) : null}

        <Text style={styles.stayTitle}>{listing.title}</Text>
        <Text style={styles.stayLocation}>{listing.location}</Text>

        <StarRow rating={listing.rating} />

        <View style={styles.amenityRow}>
          {listing.amenities.map((amenity) => (
            <StatusBadge
              key={amenity}
              label={amenity}
              tone="neutral"
              style={styles.amenityChip}
            />
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{listing.pricePerNight}</Text>
          <PrimaryButton
            label="Book Now"
            onPress={onBookPress}
            style={styles.bookButton}
          />
        </View>
      </View>
    </Card>
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


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
          <SectionHeader title="Homestays nearby" style={styles.sectionHeader} />
          <Pressable
            onPress={onFilterPress}
            style={styles.filterButton}
            accessibilityRole="button"
            accessibilityLabel="Filter listings"
          >
            <AppIcon
              name="options-outline"
              size={iconSizes.lg}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {listings.length === 0 ? (
          <EmptyState
            title="No stays to show"
            body="Host families in this area are still joining NestBridge. Try Accra or Kumasi, or check back soon."
            tip="Finish your profile to see better matches."
            iconName="home-outline"
          />
        ) : (
          <View style={styles.list}>
            {listings.map((listing) => (
              <StayCard
                key={listing.id}
                listing={listing}
                onBookPress={() => onBookPress?.(listing.id)}
              />
            ))}
          </View>
        )}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  stayCard: {
    width: '100%',
    overflow: 'hidden',
  },
  imageTile: {
    height: layout.carouselMinHeight - spacing.xl * 2,
    margin: spacing.sm,
    backgroundColor: tints.teal,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: layout.cardPadding,
    gap: spacing.sm,
  },
  stayTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
  },
  stayLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
  starRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  priceText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.teal,
    flexShrink: 1,
  },
  bookButton: {
    paddingHorizontal: spacing.md,
    minHeight: controlHeights.sm,
    paddingVertical: spacing.sm,
  },
});
}


import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import type { HostListingItem } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../../constants/theme';

export interface HostListingsScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  listings: HostListingItem[];
  onToggleOnline?: (listingId: string, isOnline: boolean) => void;
  onEditPress?: (listingId: string) => void;
  onDeletePress?: (listingId: string) => void;
  onAddListingPress?: () => void;
  onBack?: () => void;
}

function ListingCard({
  listing,
  onToggleOnline,
  onEditPress,
  onDeletePress,
}: {
  listing: HostListingItem;
  onToggleOnline?: (isOnline: boolean) => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
}) {
  return (
    <View style={styles.listingCard}>
      <View style={styles.thumbnail}>
        <AppIcon glyph={listing.imageEmoji} size={32} color={colors.tealDeep} />
      </View>

      <View style={styles.listingBody}>
        <View style={styles.onlineRow}>
          <Text style={styles.onlineLabel}>
            {listing.isOnline ? 'Online' : 'Offline'}
          </Text>
          <Switch
            value={listing.isOnline}
            onValueChange={onToggleOnline}
            trackColor={{ false: colors.border, true: colors.tealBright }}
            thumbColor={colors.white}
            accessibilityLabel={`Toggle listing ${listing.address} online status`}
          />
        </View>

        <Text style={styles.address}>{listing.address}</Text>
        <Text style={styles.scoreText}>
          Current bookings Score: {listing.bookingsScore}%
        </Text>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.actionButton}
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${listing.address}`}
          >
            <Text style={styles.actionLabel}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDeletePress}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${listing.address}`}
          >
            <Text style={[styles.actionLabel, styles.deleteLabel]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function HostListingsScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  listings,
  onToggleOnline,
  onEditPress,
  onDeletePress,
  onAddListingPress,
  onBack,
}: HostListingsScreenProps) {
  const insets = useSafeAreaInsets();

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

      <ScreenScroll contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl + 64 }}>
        <View style={styles.grid}>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onToggleOnline={(isOnline) =>
                onToggleOnline?.(listing.id, isOnline)
              }
              onEditPress={() => onEditPress?.(listing.id)}
              onDeletePress={() => onDeletePress?.(listing.id)}
            />
          ))}
        </View>
      </ScreenScroll>

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        onPress={onAddListingPress}
        accessibilityRole="button"
        accessibilityLabel="Add new listing"
      >
        <AppIcon name="add" size={fontSizes.heading} color={colors.white} />
        <Text style={styles.fabLabel}>Add New Listing</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  listingCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 88,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: {
    fontSize: 36,
  },
  listingBody: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onlineLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
  },
  address: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textPrimary,
  },
  scoreText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  actionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
  },
  deleteButton: {
    borderColor: colors.danger,
  },
  deleteLabel: {
    color: colors.danger,
  },
  fab: {
    position: 'absolute',
    right: layout.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tealBright,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
    elevation: 4,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    color: colors.white,
  },
  fabLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import EmptyState from '../../components/EmptyState';
import type { HostListingItem } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  shadows,
} from '../../constants/theme';

export interface HostListingsEmptyState {
  title: string;
  body: string;
  tip?: string;
}

export interface HostListingsScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  listings: HostListingItem[];
  emptyState?: HostListingsEmptyState;
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
          <Text
            style={[
              styles.onlineLabel,
              !listing.isOnline && styles.onlineLabelOff,
            ]}
          >
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
          Booking score: {listing.bookingsScore}%
        </Text>

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionPressed,
            ]}
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${listing.address}`}
          >
            <Text style={styles.actionLabel}>Edit</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.actionPressed,
            ]}
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
  emptyState,
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

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl + 64,
        }}
      >
        {listings.length === 0 && emptyState ? (
          <EmptyState
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconName="home-outline"
            primaryActionLabel="Add listing"
            onPrimaryAction={onAddListingPress}
          />
        ) : (
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
        )}
      </ScreenScroll>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing.lg },
          pressed && styles.fabPressed,
        ]}
        onPress={onAddListingPress}
        accessibilityRole="button"
        accessibilityLabel="Add new listing"
      >
        <AppIcon name="add" size={fontSizes.heading} color={colors.white} />
        <Text style={styles.fabLabel}>Add listing</Text>
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
    ...shadows.card,
  },
  thumbnail: {
    height: 88,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingBody: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  onlineLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  onlineLabelOff: {
    color: colors.textTertiary,
  },
  address: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  scoreText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
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
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.teal,
    backgroundColor: colors.white,
  },
  actionPressed: {
    opacity: 0.88,
    backgroundColor: colors.warmCream,
  },
  actionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
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
    ...shadows.floating,
  },
  fabPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  fabLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});

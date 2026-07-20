import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import type { HostListingItem } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  lineHeights,
  touchTarget,
  controlHeights,
  iconSizes,
} from '../../constants/theme';

export interface HostListingsEmptyState {
  title: string;
  body: string;
  tip?: string;
  iconGlyph?: string;
  primaryActionLabel?: string;
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Card padding="none" style={styles.listingCard}>
      <View style={styles.thumbnail}>
        <AppIcon glyph={listing.imageEmoji} size={iconSizes.xl} color={colors.tealDeep} />
      </View>

      <View style={styles.listingBody}>
        <View style={styles.onlineRow}>
          <StatusBadge
            label={listing.isOnline ? 'Online' : 'Offline'}
            tone={listing.isOnline ? 'success' : 'neutral'}
          />
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
    </Card>
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


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
          paddingBottom: insets.bottom + spacing.xxl + controlHeights.lg,
        }}
      >
        {listings.length === 0 && emptyState ? (
          <EmptyState
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconGlyph={emptyState.iconGlyph ?? '🏡'}
            primaryActionLabel={
              emptyState.primaryActionLabel ?? 'Add listing'
            }
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
        <AppIcon name="add" size={iconSizes.lg} color={colors.onPrimary} />
        <Text style={styles.fabLabel}>Add listing</Text>
      </Pressable>
    </View>
  );
}

function createStyles({ colors, tints, shadows }: AppTheme) {
  return StyleSheet.create({
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
    overflow: 'hidden',
  },
  thumbnail: {
    height: spacing.xxl + spacing.xl + spacing.md,
    backgroundColor: tints.cream,
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
    minHeight: touchTarget,
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
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: borderWidths.strong,
    borderColor: colors.teal,
    backgroundColor: colors.surface,
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
    minHeight: controlHeights.lg,
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
    color: colors.onPrimary,
  },
});
}


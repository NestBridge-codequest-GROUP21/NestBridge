import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import EmptyState from '../../components/EmptyState';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
  shadows,
  lineHeights,
} from '../../constants/theme';
import { formatCurrency } from '../../data/bookingMock';
export { sampleMatchResults } from '../../data/matchResultsMock';
export interface MatchResultHost {
  id: string;
  matchId?: string;
  hostName: string;
  initials: string;
  compatibilityScore: number;
  trustBadge: string;
  matchReasons: string[];
  pricePerNight: number;
  currency: string;
  location: string;
}

export interface MatchResultsScreenProps {
  results: MatchResultHost[];
  destinationLabel?: string;
  resultsCountLabel?: string;
  errorMessage?: string | null;
  onHostPress?: (hostId: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSosPress?: () => void;
}

type ViewMode = 'list' | 'map';

function trustBadgeLabel(badge: string): string {
  switch (badge.toUpperCase()) {
    case 'VERIFIED':
      return 'Verified';
    case 'TRUSTED':
      return 'Trusted host';
    case 'PRO':
      return 'Pro host';
    default:
      return badge;
  }
}

function HostMatchCard({
  host,
  onPress,
}: {
  host: MatchResultHost;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.hostCard, pressed && styles.hostCardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${host.hostName}, ${host.compatibilityScore} percent match, ${host.location}, ${formatCurrency(host.pricePerNight, host.currency)} per night`}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{host.initials}</Text>
          </View>
        </View>

        <View style={styles.cardHeaderText}>
          <Text style={styles.hostName}>{host.hostName}</Text>
          <Text style={styles.hostLocation}>{host.location}</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <LinearGradient
          colors={[...gradients.accent]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.compatBadge}
        >
          <Text style={styles.compatBadgeText}>{host.compatibilityScore}% match</Text>
        </LinearGradient>

        <View style={styles.trustBadge}>
          <Text style={styles.trustBadgeText}>{trustBadgeLabel(host.trustBadge)}</Text>
        </View>
      </View>

      <View style={styles.reasonsBlock}>
        {host.matchReasons.map((reason) => (
          <View key={reason} style={styles.reasonRow}>
            <View style={styles.reasonDot} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>From</Text>
        <Text style={styles.priceValue}>
          {formatCurrency(host.pricePerNight, host.currency)}
          <Text style={styles.priceUnit}> / night</Text>
        </Text>
      </View>
    </Pressable>
  );
}

function MapComingSoon() {
  return (
    <View style={styles.mapPlaceholder}>
      <EmptyState
        title="Map view unavailable"
        body="Browse matched hosts in the list for now. Map pins will appear here once location view is ready."
        tip="List order is still your best-to-least match ranking."
        iconName="map-outline"
        carded
      />
    </View>
  );
}

export default function MatchResultsScreen({
  results,
  destinationLabel = 'Your matches',
  resultsCountLabel,
  errorMessage,
  onHostPress,
  onBack,
  onRetry,
}: MatchResultsScreenProps) {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const countLabel =
    resultsCountLabel ?? `${results.length} host${results.length === 1 ? '' : 's'} matched to you`;

  const handleHostPress = (hostId: string) => {
    onHostPress?.(hostId);
  };

  if (errorMessage) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[...gradients.headerCompact]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
        >
          {onBack ? (
            <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.backButtonSpacer} />
          )}
          <Text style={styles.headerTitle}>{destinationLabel}</Text>
        </LinearGradient>
        <View style={styles.errorWrap}>
          <EmptyState
            title="Could not load matches"
            body={errorMessage}
            iconName="cloud-offline-outline"
            primaryActionLabel={onRetry ? 'Try again' : undefined}
            onPrimaryAction={onRetry}
          />
        </View>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[...gradients.headerCompact]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
        >
          {onBack ? (
            <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
              <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.backButtonSpacer} />
          )}
          <Text style={styles.headerTitle}>{destinationLabel}</Text>
          <Text style={styles.headerSubtitle}>No hosts matched your search yet</Text>
        </LinearGradient>
        <View style={styles.errorWrap}>
          <EmptyState
            title="No matches found"
            body="Try widening your budget or adjusting your dates, then search again."
            tip="Hosts near campus in Accra and Kumasi fill up fast — a flexible date range helps."
            iconName="search-outline"
            primaryActionLabel={onBack ? 'Edit search' : undefined}
            onPrimaryAction={onBack}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.backButtonSpacer} />
        )}

        <Text style={styles.headerTitle}>{destinationLabel}</Text>
        <Text style={styles.headerSubtitle}>{countLabel}</Text>

        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'list' }}
            accessibilityLabel="List view"
          >
            <Text
              style={[styles.toggleLabel, viewMode === 'list' && styles.toggleLabelActive]}
            >
              List
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'map' }}
            accessibilityLabel="Map view"
          >
            <Text
              style={[styles.toggleLabel, viewMode === 'map' && styles.toggleLabelActive]}
            >
              Map
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      {viewMode === 'list' ? (
        <ScrollView
          style={styles.scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingRight: layout.screenPaddingHorizontal + insets.right },
          ]}
        >
          {results.map((host) => (
            <HostMatchCard
              key={host.id}
              host={host}
              onPress={() => handleHostPress(host.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.mapContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <MapComingSoon />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  backButtonSpacer: {
    height: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    marginBottom: spacing.md,
  },
  viewToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.navyMid,
    borderRadius: borderRadius.pill,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  toggleButton: {
    minWidth: 72,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.white,
  },
  toggleLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    opacity: 0.85,
  },
  toggleLabelActive: {
    color: colors.teal,
    opacity: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  hostCard: {
    width: layout.listingCardWidth + spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.raised,
  },
  hostCardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  cardHeaderText: {
    flex: 1,
  },
  hostName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hostLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  compatBadge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compatBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  trustBadge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.warmCream,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  trustBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  reasonsBlock: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    marginTop: spacing.sm,
    marginRight: spacing.sm,
  },
  reasonText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  priceValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  priceUnit: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
  },
  errorWrap: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
  },
});

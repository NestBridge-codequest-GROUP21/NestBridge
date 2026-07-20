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
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import PrimaryButton from '../../components/PrimaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  layout,
  lineHeights,
  touchTarget,
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
    <Card padding="lg" elevation="card" style={styles.hostCard}>
      <View style={styles.cardTopRow}>
        <Avatar initials={host.initials} size="lg" highlighted style={styles.avatar} />

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

        <StatusBadge label={trustBadgeLabel(host.trustBadge)} tone="warning" />
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

      <PrimaryButton label="View host" onPress={onPress} />
    </Card>
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
        <ScreenHeader
          title={destinationLabel}
          compact
          onBack={onBack}
        />
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
        <ScreenHeader
          title={destinationLabel}
          subtitle="No hosts matched your search yet"
          compact
          onBack={onBack}
        />
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

      <ScreenHeader
        title={destinationLabel}
        subtitle={countLabel}
        compact
        onBack={onBack}
      />

      <View style={styles.toggleWrap}>
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
      </View>

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
  toggleWrap: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
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
    minHeight: touchTarget,
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  hostCard: {
    width: layout.listingCardWidth + spacing.xl,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    marginRight: spacing.md,
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
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
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

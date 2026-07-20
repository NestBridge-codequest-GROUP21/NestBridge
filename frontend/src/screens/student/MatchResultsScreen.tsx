import React from 'react';
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
import StatusBadge, { type StatusBadgeTone } from '../../components/StatusBadge';
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

function trustBadgeTone(badge: string): StatusBadgeTone {
  switch (badge.toUpperCase()) {
    case 'VERIFIED':
      return 'success';
    case 'TRUSTED':
      return 'info';
    case 'PRO':
      return 'accent';
    default:
      return 'neutral';
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
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${host.hostName}, ${host.compatibilityScore}% match`}
    >
      <Card padding="lg" elevation="card" style={styles.hostCard}>
        <View style={styles.cardTopRow}>
          <Avatar initials={host.initials} size="lg" highlighted style={styles.avatar} />

          <View style={styles.cardHeaderText}>
            <Text style={styles.hostName} numberOfLines={2}>
              {host.hostName}
            </Text>
            <Text style={styles.hostLocation} numberOfLines={2}>
              {host.location}
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <LinearGradient
            colors={[...gradients.accent]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.compatBadge}
          >
            <Text style={styles.compatBadgeText}>
              {host.compatibilityScore}% match
            </Text>
          </LinearGradient>

          <StatusBadge
            label={trustBadgeLabel(host.trustBadge)}
            tone={trustBadgeTone(host.trustBadge)}
          />
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

        <Text style={styles.listAction}>View host</Text>
      </Card>
    </Pressable>
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

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  hostCard: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.94,
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hostLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.caption,
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
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
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    marginTop: spacing.sm - spacing.xs,
    marginRight: spacing.sm,
  },
  reasonText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.caption,
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  priceUnit: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  listAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    minHeight: touchTarget,
    textAlignVertical: 'center',
    lineHeight: touchTarget,
  },
  errorWrap: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
  },
});

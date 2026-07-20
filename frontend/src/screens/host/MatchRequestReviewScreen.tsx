import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import SecondaryButton from '../../components/SecondaryButton';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  shadows,
  layout,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';
import { formatBookingDate, formatCurrency } from '../../data/bookingMock';

export interface MatchRequestReviewScreenProps {
  request: IncomingBookingRequest;
  acceptBlocked?: boolean;
  acceptBlockedMessage?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onContinueSetup?: () => void;
  onBack?: () => void;
}

function CapacityDots({
  accepted,
  max,
}: {
  accepted: number;
  max: number;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < accepted;
        return (
          <View
            key={`slot-${index}`}
            style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
          />
        );
      })}
    </View>
  );
}

export default function MatchRequestReviewScreen({
  request,
  acceptBlocked = false,
  acceptBlockedMessage = 'Finish your Host profile to accept requests.',
  onAccept,
  onDecline,
  onContinueSetup,
  onBack,
}: MatchRequestReviewScreenProps) {
  const insets = useSafeAreaInsets();
  const { capacity, priceBreakdown } = request;
  const slotsLabel = `${capacity.overlappingAccepted} of ${capacity.maxAllowed} guest slots used`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Booking request"
        subtitle="Review before accepting"
        onBack={onBack}
        compact
      />

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xxl * 3 + layout.cardPadding,
        }}
      >
        <Card padding="lg" style={styles.studentHero}>
          <Avatar initials={request.studentInitials} size="lg" style={styles.heroAvatar} />
          <Text style={styles.studentName}>{request.studentName}</Text>
          <Text style={styles.studentMeta}>
            {request.studentOrigin} · {request.studentUniversity}
          </Text>
          <StatusBadge
            label={`${request.compatibilityScore}% compatible`}
            tone="info"
          />
        </Card>

        {request.message ? (
          <Card padding="lg" elevation="none" style={styles.messageCard}>
            <Text style={styles.messageLabel}>Message from student</Text>
            <Text style={styles.messageText}>{request.message}</Text>
          </Card>
        ) : null}

        <SectionHeader title="Requested dates" />
        <Card padding="lg" style={styles.sectionCard}>
          <Text style={styles.datesValue}>
            {formatBookingDate(request.checkIn)} – {formatBookingDate(request.checkOut)}
          </Text>
          <Text style={styles.datesPeriod}>{capacity.periodLabel}</Text>
        </Card>

        <SectionHeader title="Your capacity" />
        <Card
          padding="lg"
          style={[
            styles.sectionCard,
            !capacity.canAccept && styles.capacityCardWarning,
          ]}
        >
          <CapacityDots
            accepted={capacity.overlappingAccepted}
            max={capacity.maxAllowed}
          />
          <Text style={styles.capacityTitle}>{slotsLabel}</Text>
          <Text style={styles.capacityHint}>
            {capacity.canAccept
              ? 'You can accept up to 2 overlapping stays so every guest gets enough attention.'
              : capacity.declineReason}
          </Text>
        </Card>

        <SectionHeader title="Earnings summary" />
        <Card padding="lg" elevation="none" style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Guest pays</Text>
            <Text style={styles.earningsValue}>
              {formatCurrency(priceBreakdown.total, priceBreakdown.currency)}
            </Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Your payout (after fees)</Text>
            <Text style={[styles.earningsValue, styles.earningsHighlight]}>
              {formatCurrency(
                priceBreakdown.subtotal,
                priceBreakdown.currency,
              )}
            </Text>
          </View>
        </Card>
      </ScreenScroll>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        {acceptBlocked ? (
          <ProfileIncompleteBanner
            message={acceptBlockedMessage}
            onContinueSetup={onContinueSetup}
          />
        ) : null}
        <PrimaryButton
          label="Accept request"
          onPress={onAccept}
          disabled={!capacity.canAccept || acceptBlocked}
        />
        <View style={styles.declineSpacing}>
          <SecondaryButton label="Decline" onPress={onDecline} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  studentHero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroAvatar: {
    marginBottom: spacing.md,
  },
  studentName: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  studentMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: lineHeights.body,
  },
  messageCard: {
    backgroundColor: colors.warmCream,
    marginBottom: spacing.lg,
  },
  messageLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  messageText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
    fontStyle: 'italic',
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  datesValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  datesPeriod: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  capacityCardWarning: {
    borderColor: colors.warning,
    backgroundColor: colors.warmCream,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dot: {
    width: spacing.md,
    height: spacing.md,
    borderRadius: borderRadius.pill,
  },
  dotFilled: {
    backgroundColor: colors.tealBright,
  },
  dotEmpty: {
    backgroundColor: colors.border,
  },
  capacityTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  capacityHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  earningsCard: {
    backgroundColor: colors.warmCream,
    marginBottom: spacing.lg,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  earningsLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    flex: 1,
    paddingRight: spacing.md,
  },
  earningsValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  earningsHighlight: {
    fontFamily: fontFamilies.semibold,
    color: colors.tealDeep,
    fontWeight: fontWeights.semibold,
  },
  earningsDivider: {
    height: borderWidths.hairline,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  declineSpacing: {
    marginTop: spacing.sm,
  },
});

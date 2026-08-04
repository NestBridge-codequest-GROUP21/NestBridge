import { useThemedStyles, type AppTheme, useTheme } from '../../theme';
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
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';
import { formatCurrency } from '../../data/bookingMock';
import { formatSessionSchedule } from '../../data/guideSessionMock';

export interface SessionReviewScreenProps {
  request: IncomingBookingRequest;
  acceptBlocked?: boolean;
  acceptBlockedMessage?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onContinueSetup?: () => void;
  onBack?: () => void;
}

function CapacityDots({ accepted, max }: { accepted: number; max: number }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: max }).map((_, index) => (
        <View
          key={`slot-${index}`}
          style={[styles.dot, index < accepted ? styles.dotFilled : styles.dotEmpty]}
        />
      ))}
    </View>
  );
}

export default function SessionReviewScreen({
  request,
  acceptBlocked = false,
  acceptBlockedMessage = 'Finish your Guide profile to accept sessions.',
  onAccept,
  onDecline,
  onContinueSetup,
  onBack,
}: SessionReviewScreenProps) {
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();
  const { capacity, session, sessionPrice } = request;
  const sessionLine =
    session &&
    formatSessionSchedule(session.sessionDate, session.sessionStartTime, session.durationHours);
  const slotsLabel = `${capacity.overlappingAccepted} of ${capacity.maxAllowed} session slots used`;
  const earnings = sessionPrice ?? {
    sessionRate: 0,
    currency: 'GHS',
    platformFee: 0,
    total: 0,
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Session request"
        subtitle="Review before accepting"
        onBack={onBack}
        compact
      />

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xxl * 3 + layout.cardPadding,
        }}
      >
        <Card padding="lg" style={styles.hero}>
          <Avatar initials={request.studentInitials} size="lg" style={styles.heroAvatar} />
          <Text style={styles.name}>{request.studentName}</Text>
          <Text style={styles.meta}>
            {request.studentOrigin} · {request.studentUniversity}
          </Text>
          <StatusBadge
            label={request.seekerRole === 'TOURIST' ? 'Tourist request' : 'Student request'}
            tone="neutral"
            style={styles.roleBadge}
          />
          <StatusBadge
            label={`${request.compatibilityScore}% compatible`}
            tone="info"
          />
        </Card>

        {request.message ? (
          <Card padding="lg" elevation="none" style={styles.messageCard}>
            <Text style={styles.messageLabel}>Message</Text>
            <Text style={styles.messageText}>{request.message}</Text>
          </Card>
        ) : null}

        <SectionHeader title="Session time" />
        <Card padding="lg" style={styles.sectionCard}>
          <Text style={styles.datesValue}>{sessionLine ?? 'Schedule pending'}</Text>
          <Text style={styles.datesPeriod}>{capacity.periodLabel}</Text>
        </Card>

        <SectionHeader title="Your capacity" />
        <Card
          padding="lg"
          style={[
            styles.sectionCard,
            !capacity.canAccept && styles.capacityWarning,
          ]}
        >
          <CapacityDots
            accepted={capacity.overlappingAccepted}
            max={capacity.maxAllowed}
          />
          <Text style={styles.capacityTitle}>{slotsLabel}</Text>
          <Text style={styles.capacityHint}>
            {capacity.canAccept
              ? 'You can accept up to 2 overlapping sessions.'
              : capacity.declineReason}
          </Text>
        </Card>

        <SectionHeader title="Earnings" />
        <Card padding="lg" elevation="none" style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Guest pays</Text>
            <Text style={styles.earningsValue}>
              {formatCurrency(earnings.total, earnings.currency)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Your payout</Text>
            <Text style={[styles.earningsValue, styles.earningsHighlight]}>
              {formatCurrency(earnings.sessionRate, earnings.currency)}
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
          label="Accept session"
          tone="success"
          onPress={onAccept}
          disabled={!capacity.canAccept || acceptBlocked}
        />
        <View style={styles.declineWrap}>
          <PrimaryButton label="Decline" tone="danger" onPress={onDecline} />
        </View>
      </View>
    </View>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroAvatar: {
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  meta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: lineHeights.body,
  },
  roleBadge: {
    marginBottom: spacing.sm,
  },
  messageCard: {
    backgroundColor: colors.warmCream,
    marginBottom: spacing.lg,
  },
  messageLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  datesPeriod: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  capacityWarning: {
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
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
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
    paddingVertical: spacing.sm,
  },
  earningsLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  earningsValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  earningsHighlight: {
    fontFamily: fontFamilies.bold,
    color: colors.onAccent,
    fontWeight: fontWeights.bold,
  },
  divider: {
    height: borderWidths.hairline,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  declineWrap: {
    marginTop: spacing.sm,
  },
});
}


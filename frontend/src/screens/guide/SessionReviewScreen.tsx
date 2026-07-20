import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import SecondaryButton from '../../components/SecondaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  lineHeights,
  shadows,
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

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton
          onPress={onBack}
          color={colors.white}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Session request</Text>
        <Text style={styles.headerSubtitle}>Review before accepting</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{request.studentInitials}</Text>
          </View>
          <Text style={styles.name}>{request.studentName}</Text>
          <Text style={styles.meta}>
            {request.studentOrigin} · {request.studentUniversity}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {request.seekerRole === 'TOURIST' ? 'Tourist' : 'Student'} request
            </Text>
          </View>
          <View style={styles.compatBadge}>
            <Text style={styles.compatText}>{request.compatibilityScore}% compatible</Text>
          </View>
        </View>

        {request.message ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageLabel}>Message</Text>
            <Text style={styles.messageText}>{request.message}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Session time</Text>
        <View style={styles.datesCard}>
          <Text style={styles.datesValue}>{sessionLine ?? 'Schedule pending'}</Text>
          <Text style={styles.datesPeriod}>{capacity.periodLabel}</Text>
        </View>

        <Text style={styles.sectionLabel}>Your capacity</Text>
        <View
          style={[
            styles.capacityCard,
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
        </View>

        <Text style={styles.sectionLabel}>Earnings</Text>
        <View style={styles.earningsCard}>
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
        </View>
      </ScrollView>

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
          onPress={onAccept}
          disabled={!capacity.canAccept || acceptBlocked}
        />
        <View style={styles.declineWrap}>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
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
    lineHeight: lineHeights.body,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
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
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.sm,
  },
  roleBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  compatBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  compatText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  messageCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
  sectionLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  datesCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
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
  capacityCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
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
    width: 16,
    height: 16,
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
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.tealDeep,
    fontWeight: fontWeights.bold,
  },
  divider: {
    height: 1,
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
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  declineWrap: {
    marginTop: spacing.sm,
  },
});

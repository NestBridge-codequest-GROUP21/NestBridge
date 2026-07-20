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
        <Text style={styles.headerTitle}>Booking request</Text>
        <Text style={styles.headerSubtitle}>Review before accepting</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.studentHero}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>{request.studentInitials}</Text>
          </View>
          <Text style={styles.studentName}>{request.studentName}</Text>
          <Text style={styles.studentMeta}>
            {request.studentOrigin} · {request.studentUniversity}
          </Text>
          <View style={styles.compatBadge}>
            <Text style={styles.compatText}>{request.compatibilityScore}% compatible</Text>
          </View>
        </View>

        {request.message ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageLabel}>Message from student</Text>
            <Text style={styles.messageText}>{request.message}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Requested dates</Text>
        <View style={styles.datesCard}>
          <Text style={styles.datesValue}>
            {formatBookingDate(request.checkIn)} – {formatBookingDate(request.checkOut)}
          </Text>
          <Text style={styles.datesPeriod}>{capacity.periodLabel}</Text>
        </View>

        <Text style={styles.sectionLabel}>Your capacity</Text>
        <View
          style={[
            styles.capacityCard,
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
        </View>

        <Text style={styles.sectionLabel}>Earnings summary</Text>
        <View style={styles.earningsCard}>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  studentHero: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  studentAvatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  studentAvatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  studentName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
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
    fontFamily: fontFamilies.bold,
    color: colors.tealDeep,
    fontWeight: fontWeights.bold,
  },
  earningsDivider: {
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
  declineSpacing: {
    marginTop: spacing.sm,
  },
});

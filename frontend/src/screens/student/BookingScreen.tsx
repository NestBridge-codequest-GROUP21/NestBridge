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
import { GatedPrimaryButton } from '../../components/ProfileIncompleteBanner';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
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
  layout,
  tints,
} from '../../constants/theme';
import type { HostProfileSummary, PriceBreakdown } from '../../types/booking';
import { formatBookingDate, formatCurrency } from '../../data/bookingMock';

export interface BookingScreenProps {
  host: HostProfileSummary;
  showMatchScores?: boolean;
  checkIn: string;
  checkOut: string;
  priceBreakdown: PriceBreakdown;
  requestBlocked?: boolean;
  requestBlockedMessage?: string;
  submitErrorMessage?: string | null;
  onSendRequest?: () => void;
  onContinueSetup?: () => void;
  onBack?: () => void;
}

function PriceRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, bold && styles.priceLabelBold]}>{label}</Text>
      <Text
        style={[
          styles.priceValue,
          bold && styles.priceValueBold,
          accent && styles.priceValueAccent,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function BookingScreen({
  host,
  showMatchScores = false,
  checkIn,
  checkOut,
  priceBreakdown,
  requestBlocked = false,
  requestBlockedMessage = 'Finish your Student or Tourist profile to book.',
  submitErrorMessage,
  onSendRequest,
  onContinueSetup,
  onBack,
}: BookingScreenProps) {
  const insets = useSafeAreaInsets();
  const { currency, nightlyRate, nights, subtotal, platformFee, total } =
    priceBreakdown;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.white} style={styles.back} />
        <Text style={styles.headerTitle}>Request to book</Text>
        <Text style={styles.headerSubtitle}>
          Review your stay details before sending a request to the host
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hostCard}>
          <View style={styles.hostIconWrap}>
            <Text style={styles.hostInitials}>{host.initials}</Text>
          </View>
          <View style={styles.hostInfo}>
            <Text style={styles.hostName}>{host.name}</Text>
            <Text style={styles.hostLocation}>{host.location}</Text>
            {showMatchScores ? (
              <View style={styles.matchRow}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>{host.matchPercentage}% match</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Your stay</Text>
        <View style={styles.datesCard}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{formatBookingDate(checkIn)}</Text>
          </View>
          <View style={styles.dateDivider} />
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{formatBookingDate(checkOut)}</Text>
          </View>
        </View>
        <Text style={styles.nightsHint}>
          {nights} {nights === 1 ? 'night' : 'nights'} · Host will review before you pay
        </Text>

        <Text style={styles.sectionLabel}>Price summary</Text>
        <View style={styles.priceCard}>
          <PriceRow
            label={`${formatCurrency(nightlyRate, currency)} × ${nights} nights`}
            value={formatCurrency(subtotal, currency)}
          />
          <View style={styles.priceDivider} />
          <PriceRow
            label="Platform fee (5%)"
            value={formatCurrency(platformFee, currency)}
          />
          <View style={styles.priceDivider} />
          <PriceRow
            label="Total"
            value={formatCurrency(total, currency)}
            bold
            accent
          />
        </View>

        <Text style={styles.sectionLabel}>Cancellation policy</Text>
        <View style={styles.policyCard}>
          <AppIcon
            name="document-text-outline"
            size={fontSizes.subheading}
            color={colors.tealDeep}
            style={styles.policyIcon}
          />
          <Text style={styles.policyText}>{host.cancellationPolicy}</Text>
        </View>

        <View style={styles.escrowCard}>
          <View style={styles.escrowTitleRow}>
            <AppIcon
              name="shield-checkmark-outline"
              size={fontSizes.subheading}
              color={colors.tealDeep}
            />
            <Text style={styles.escrowTitle}>Held in escrow</Text>
          </View>
          <Text style={styles.escrowText}>
            Payment is held securely until 24 hours after check-in. You are only
            charged after the host accepts your request.
          </Text>
        </View>

        {submitErrorMessage ? (
          <InlineBanner message={submitErrorMessage} tone="error" style={styles.errorBanner} />
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <GatedPrimaryButton
          label="Send booking request"
          blocked={requestBlocked}
          blockedMessage={requestBlockedMessage}
          onPress={onSendRequest}
          onContinueSetup={onContinueSetup}
        />
        <Text style={styles.footerHint}>
          You will only pay after the host accepts your request
        </Text>
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
  },
  back: {
    marginBottom: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.display,
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
    marginTop: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  hostIconWrap: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: tints.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hostInitials: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: lineHeights.heading,
  },
  hostLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.body,
  },
  matchRow: {
    flexDirection: 'row',
  },
  matchBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  matchBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    lineHeight: lineHeights.caption,
  },
  dateValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  dateDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  nightsHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: lineHeights.body,
  },
  priceCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    paddingRight: spacing.md,
  },
  priceLabelBold: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  priceValue: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  priceValueBold: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.subheading,
  },
  priceValueAccent: {
    color: colors.tealDeep,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  policyIcon: {
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  policyText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  escrowCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
    ...shadows.card,
  },
  escrowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  escrowTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  escrowText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  errorBanner: {
    marginTop: spacing.lg,
    marginBottom: 0,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  footerHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
});

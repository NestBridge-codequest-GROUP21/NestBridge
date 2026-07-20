import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GatedPrimaryButton } from '../../components/ProfileIncompleteBanner';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  lineHeights,
  shadows,
  layout,
  iconSizes,
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

      <ScreenHeader
        title="Request to book"
        subtitle="Review your stay details before sending a request to the host"
        compact
        onBack={onBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card padding="lg" elevation="card" style={styles.hostCard}>
          <View style={styles.hostRow}>
            <Avatar initials={host.initials} size="lg" style={styles.hostAvatar} />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>{host.name}</Text>
              <Text style={styles.hostLocation}>{host.location}</Text>
              {showMatchScores ? (
                <StatusBadge
                  label={`${host.matchPercentage}% match`}
                  tone="success"
                  style={styles.matchBadge}
                />
              ) : null}
            </View>
          </View>
        </Card>

        <SectionHeader title="Your stay" />
        <Card padding="lg" elevation="card" style={styles.datesCard}>
          <View style={styles.datesInner}>
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
        </Card>
        <Text style={styles.nightsHint}>
          {nights} {nights === 1 ? 'night' : 'nights'} · Host will review before you pay
        </Text>

        <SectionHeader title="Price summary" />
        <Card padding="lg" elevation="card" style={styles.priceCard}>
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
        </Card>

        <SectionHeader title="Cancellation policy" />
        <Card padding="lg" elevation="card" style={styles.policyCard}>
          <AppIcon
            name="document-text-outline"
            size={iconSizes.md}
            color={colors.tealDeep}
            style={styles.policyIcon}
          />
          <Text style={styles.policyText}>{host.cancellationPolicy}</Text>
        </Card>

        <Card padding="lg" elevation="card" style={styles.escrowCard}>
          <View style={styles.escrowTitleRow}>
            <AppIcon
              name="shield-checkmark-outline"
              size={iconSizes.md}
              color={colors.tealDeep}
            />
            <Text style={styles.escrowTitle}>Held in escrow</Text>
          </View>
          <Text style={styles.escrowText}>
            Payment is held securely until 24 hours after check-in. You are only
            charged after the host accepts your request.
          </Text>
        </Card>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  hostCard: {
    marginBottom: spacing.xl,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: {
    marginRight: spacing.md,
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
  matchBadge: {
    alignSelf: 'flex-start',
  },
  datesCard: {
    marginBottom: spacing.sm,
  },
  datesInner: {
    flexDirection: 'row',
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
    width: borderWidths.hairline,
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
    marginBottom: spacing.xl,
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
    height: borderWidths.hairline,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: spacing.lg,
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
    borderTopWidth: borderWidths.hairline,
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

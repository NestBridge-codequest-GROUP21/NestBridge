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
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Avatar from '../../components/Avatar';
import AppIcon from '../../components/AppIcon';
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
import type { GuideProfileSummary, SessionPriceBreakdown } from '../../types/booking';
import {
  formatBookingDate,
  formatCurrency,
} from '../../data/bookingMock';
import {
  formatSessionSchedule,
  formatSessionTime,
} from '../../data/guideSessionMock';

export interface SessionBookingScreenProps {
  guide: GuideProfileSummary;
  sessionDate: string;
  sessionStartTime: string;
  sessionPrice: SessionPriceBreakdown;
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

export default function SessionBookingScreen({
  guide,
  sessionDate,
  sessionStartTime,
  sessionPrice,
  requestBlocked = false,
  requestBlockedMessage = 'Finish your Student or Tourist profile to book.',
  submitErrorMessage,
  onSendRequest,
  onContinueSetup,
  onBack,
}: SessionBookingScreenProps) {
  const insets = useSafeAreaInsets();
  const { sessionRate, currency, platformFee, total } = sessionPrice;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Book a session"
        subtitle="Review details before requesting your guide"
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
        <Card padding="lg" elevation="card" style={styles.guideCard}>
          <View style={styles.guideRow}>
            <Avatar initials={guide.initials} size="lg" style={styles.guideAvatar} />
            <View style={styles.guideInfo}>
              <Text style={styles.guideName}>{guide.name}</Text>
              <Text style={styles.guideLocation}>{guide.location}</Text>
            </View>
          </View>
        </Card>

        <SectionHeader title="Session schedule" />
        <Card padding="lg" elevation="card" style={styles.scheduleCard}>
          <View style={styles.scheduleInner}>
            <View style={styles.scheduleBlock}>
              <Text style={styles.scheduleLabel}>Date</Text>
              <Text style={styles.scheduleValue}>{formatBookingDate(sessionDate)}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleBlock}>
              <Text style={styles.scheduleLabel}>Start time</Text>
              <Text style={styles.scheduleValue}>
                {formatSessionTime(sessionStartTime)}
              </Text>
            </View>
          </View>
        </Card>
        <Text style={styles.scheduleHint}>
          {formatSessionSchedule(
            sessionDate,
            sessionStartTime,
            guide.sessionDurationHours,
          )}{' '}
          · Guide will review before you pay
        </Text>

        <SectionHeader title="Price summary" />
        <Card padding="lg" elevation="card" style={styles.priceCard}>
          <PriceRow
            label={`Session (${guide.sessionDurationHours}h)`}
            value={formatCurrency(sessionRate, currency)}
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
          <Text style={styles.policyText}>{guide.cancellationPolicy}</Text>
        </Card>

        {submitErrorMessage ? (
          <InlineBanner tone="error" message={submitErrorMessage} style={styles.errorBanner} />
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <GatedPrimaryButton
          label="Send session request"
          blocked={requestBlocked}
          blockedMessage={requestBlockedMessage}
          onPress={onSendRequest}
          onContinueSetup={onContinueSetup}
        />
        <Text style={styles.footerHint}>
          You will only pay after the guide accepts your request
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
  guideCard: {
    marginBottom: spacing.xl,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideAvatar: {
    marginRight: spacing.md,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guideLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  scheduleCard: {
    marginBottom: spacing.sm,
  },
  scheduleInner: {
    flexDirection: 'row',
  },
  scheduleBlock: {
    flex: 1,
  },
  scheduleLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  scheduleValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  scheduleDivider: {
    width: borderWidths.hairline,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  scheduleHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
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
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
});

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

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />
        <Text style={styles.headerTitle}>Book a session</Text>
        <Text style={styles.headerSubtitle}>
          Review details before requesting your guide
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
        <View style={styles.guideCard}>
          <View style={styles.guideIconWrap}>
            <Text style={styles.guideInitials}>{guide.initials}</Text>
          </View>
          <View style={styles.guideInfo}>
            <Text style={styles.guideName}>{guide.name}</Text>
            <Text style={styles.guideLocation}>{guide.location}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Session schedule</Text>
        <View style={styles.scheduleCard}>
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
        <Text style={styles.scheduleHint}>
          {formatSessionSchedule(
            sessionDate,
            sessionStartTime,
            guide.sessionDurationHours,
          )}{' '}
          · Guide will review before you pay
        </Text>

        <Text style={styles.sectionLabel}>Price summary</Text>
        <View style={styles.priceCard}>
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
        </View>

        <Text style={styles.sectionLabel}>Cancellation policy</Text>
        <View style={styles.policyCard}>
          <Text style={styles.policyText}>{guide.cancellationPolicy}</Text>
        </View>

        {submitErrorMessage ? (
          <InlineBanner tone="error" message={submitErrorMessage} />
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  guideCard: {
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
  guideIconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  guideInitials: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
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
  sectionLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.card,
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
    width: 1,
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
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
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
  policyText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
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
  footerHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
});

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
import { GatedPrimaryButton } from '../../components/ProfileIncompleteBanner';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
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
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Book a session</Text>
        <Text style={styles.headerSubtitle}>
          Review your tour details before sending
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
          <Text style={styles.submitError}>{submitErrorMessage}</Text>
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
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: 22,
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
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guideLocation: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  sectionLabel: {
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
  },
  scheduleBlock: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  scheduleValue: {
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
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
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
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    paddingRight: spacing.md,
  },
  priceLabelBold: {
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  priceValue: {
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  priceValueBold: {
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
  },
  policyIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  policyText: {
    flex: 1,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
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
  },
  footerHint: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  submitError: {
    fontSize: fontSizes.caption,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

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
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import BackButton from '../../components/BackButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  lineHeights,
  layout,
  shadows,
} from '../../constants/theme';
import type { HostProfileSummary } from '../../types/booking';
import { formatCurrency } from '../../data/bookingMock';

export interface HostProfileScreenProps {
  host: HostProfileSummary;
  showMatchScores?: boolean;
  /** Host bio — pass from parent/API; omit to hide the About section. */
  about?: string;
  /** Amenity / lifestyle chips — pass from parent/API. */
  highlights?: string[];
  onMessagePress?: () => void;
  onBookPress?: () => void;
  onBack?: () => void;
}

export default function HostProfileScreen({
  host,
  showMatchScores = false,
  about,
  highlights = [],
  onMessagePress,
  onBookPress,
  onBack,
}: HostProfileScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.header]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.white} style={styles.back} />

        <View style={styles.heroContent}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{host.initials}</Text>
            </View>
          </View>
          <Text style={styles.hostName}>{host.name}</Text>
          <Text style={styles.hostLocation}>{host.location}</Text>
          {showMatchScores ? (
            <LinearGradient
              colors={[...gradients.accent]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.matchBadge}
            >
              <Text style={styles.matchBadgeText}>{host.matchPercentage}% match</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.matchHint}>
              Complete your profile to see compatibility
            </Text>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl * 4 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(host.pricePerNight, host.currency)}
            <Text style={styles.priceUnit}> / night</Text>
          </Text>
        </View>

        {about ? (
          <>
            <Text style={styles.sectionTitle}>About this host</Text>
            <Text style={styles.aboutText}>{about}</Text>
          </>
        ) : null}

        {highlights.length > 0 ? (
          <View style={styles.highlights}>
            {highlights.map((label) => (
              <View key={label} style={styles.highlightChip}>
                <Text style={styles.highlightLabel}>{label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {host.cancellationPolicy ? (
          <View style={styles.policyCard}>
            <Text style={styles.policyTitle}>Cancellation</Text>
            <Text style={styles.policyBody}>{host.cancellationPolicy}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={styles.footerRow}>
          <View style={styles.messageButtonWrap}>
            <SecondaryButton label="Message" onPress={onMessagePress} />
          </View>
          <View style={styles.bookButtonWrap}>
            <PrimaryButton label="Request to book" onPress={onBookPress} />
          </View>
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
  hero: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  back: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  heroContent: {
    alignItems: 'center',
  },
  avatarRing: {
    padding: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  hostName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  hostLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  matchBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  matchBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  matchHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.white,
    opacity: 0.88,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  priceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  priceLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  priceValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  priceUnit: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  highlightLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  policyCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  policyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  policyBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
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
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  messageButtonWrap: {
    flex: 1,
  },
  bookButtonWrap: {
    flex: 1.4,
  },
});

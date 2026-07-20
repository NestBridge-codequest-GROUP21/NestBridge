import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
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
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Avatar from '../../components/Avatar';
import VerificationBadges from '../../components/VerificationBadges';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  lineHeights,
  layout,
  touchTarget,
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
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Profile hero with large avatar — not a clean ScreenHeader map. */}
      <LinearGradient
        colors={[...gradients.header]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.onPrimary} style={styles.back} />

        <View style={styles.heroContent}>
          <View style={styles.avatarRing}>
            <Avatar initials={host.initials} size="xl" />
          </View>
          <Text style={styles.hostName}>{host.name}</Text>
          <Text style={styles.hostLocation}>{host.location}</Text>
          <VerificationBadges
            verification={host.verification}
            variant="host"
            onDark
            style={styles.verification}
          />
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
          { paddingBottom: insets.bottom + layout.scrollBottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card padding="lg" elevation="card" style={styles.priceCard}>
          <Text style={styles.priceLabel}>Nightly rate</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(host.pricePerNight, host.currency)}
            <Text style={styles.priceUnit}> / night</Text>
          </Text>
          <Text style={styles.priceHint}>
            Platform fee and total appear before you pay on the booking screen.
          </Text>
        </Card>

        {about ? (
          <View style={styles.sectionBlock}>
            <SectionHeader title="About this host" />
            <Card padding="lg" elevation="card">
              <Text style={styles.aboutText}>{about}</Text>
            </Card>
          </View>
        ) : null}

        {highlights.length > 0 ? (
          <View style={styles.sectionBlock}>
            <SectionHeader title="Highlights" />
            <View style={styles.highlights}>
              {highlights.map((label) => (
                <View key={label} style={styles.highlightChip}>
                  <Text style={styles.highlightLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {host.cancellationPolicy ? (
          <View style={styles.sectionBlock}>
            <SectionHeader title="Cancellation" />
            <Card padding="md" elevation="none" style={styles.policyCard}>
              <Text style={styles.policyBody}>{host.cancellationPolicy}</Text>
            </Card>
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
          <SecondaryButton
            label="Message"
            onPress={onMessagePress}
            style={styles.messageButton}
          />
          <PrimaryButton
            label="Request to book"
            onPress={onBookPress}
            style={styles.bookButton}
          />
        </View>
      </View>
    </View>
  );
}

function createStyles({ colors, tints, shadows }: AppTheme) {
  return StyleSheet.create({
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
    borderWidth: borderWidths.strong,
    borderColor: colors.white,
    marginBottom: spacing.md,
    backgroundColor: tints.cream,
  },
  hostName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.heading,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  hostLocation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.onPrimary,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  verification: {
    marginBottom: spacing.md,
  },
  matchBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  matchBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.onPrimary,
  },
  matchHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.onPrimary,
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
    marginBottom: spacing.lg,
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
  priceHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
    marginTop: spacing.sm,
  },
  sectionBlock: {
    marginBottom: spacing.lg,
  },
  aboutText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    minHeight: touchTarget,
  },
  highlightLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  policyCard: {
    backgroundColor: colors.warmCream,
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
    backgroundColor: colors.surface,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  messageButton: {
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: spacing.md,
  },
  bookButton: {
    flex: 1,
    minWidth: 0,
  },
});
}


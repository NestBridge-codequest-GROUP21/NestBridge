import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import VerificationBadges from '../../components/VerificationBadges';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  lineHeights,
  avatarSizes,
} from '../../constants/theme';
import type { GuideProfileSummary } from '../../types/booking';
import { formatCurrency } from '../../data/bookingMock';

export interface GuideProfileDetailScreenProps {
  guide: GuideProfileSummary;
  showMatchScores?: boolean;
  setupIncomplete?: boolean;
  setupMessage?: string;
  onContinueSetup?: () => void;
  onMessagePress?: () => void;
  onBookPress?: () => void;
  onBack?: () => void;
}

export default function GuideProfileDetailScreen({
  guide,
  showMatchScores = false,
  setupIncomplete = false,
  setupMessage = 'Complete your travel profile to message guides and book a session.',
  onContinueSetup,
  onMessagePress,
  onBookPress,
  onBack,
}: GuideProfileDetailScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();
  const heroAvatarSize = avatarSizes.lg + spacing.xl;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={gradients.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.onPrimary} style={styles.backButton} />

        <View style={styles.heroContent}>
          <View style={styles.avatarRing}>
            <View
              style={[
                styles.avatarWrap,
                { width: heroAvatarSize, height: heroAvatarSize },
              ]}
            >
              <Avatar initials={guide.initials} size="lg" highlighted />
            </View>
          </View>
          <Text style={styles.name}>{guide.name}</Text>
          <Text style={styles.location}>{guide.location}</Text>
          <VerificationBadges
            verification={guide.verification}
            variant="guide"
            onDark
            style={styles.verification}
          />
          {showMatchScores ? (
            <StatusBadge
              label={`${guide.matchPercentage}% match`}
              tone="accent"
            />
          ) : (
            <Text style={styles.matchHint}>
              Complete your profile to see compatibility
            </Text>
          )}
        </View>
      </LinearGradient>

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + 140,
        }}
      >
        <Card style={styles.priceCard} padding="lg">
          <Text style={styles.priceLabel}>Session rate</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(guide.pricePerSession, guide.currency)}
          </Text>
          <Text style={styles.duration}>
            {guide.sessionDurationHours} hour sessions
          </Text>
        </Card>

        <SectionHeader title="Services offered" />
        <View style={styles.chips}>
          {(guide.serviceTypes ?? []).map((service) => (
            <StatusBadge key={service} label={service} tone="neutral" />
          ))}
        </View>

        <SectionHeader title="Languages" />
        <Text style={styles.bodyText}>{(guide.languages ?? []).join(' · ')}</Text>

        <SectionHeader title="About" />
        <Text style={styles.bodyText}>
          {guide.serviceTypes.slice(0, 2).join(' and ')} around {guide.location}.
          Sessions last {guide.sessionDurationHours} hours and can cover markets,
          transport tips, and settling into daily life in Ghana.
        </Text>
      </ScreenScroll>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        {setupIncomplete ? (
          <View style={styles.setupBanner}>
            <ProfileIncompleteBanner
              message={setupMessage}
              continueLabel="Complete Profile"
              onContinueSetup={onContinueSetup}
            />
          </View>
        ) : null}
        <View style={styles.footerRow}>
          <SecondaryButton
            label="Message"
            onPress={setupIncomplete ? onContinueSetup : onMessagePress}
            style={styles.messageButton}
          />
          <PrimaryButton
            label="Book session"
            onPress={setupIncomplete ? onContinueSetup : onBookPress}
            style={styles.bookButton}
          />
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
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
  },
  avatarWrap: {
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  location: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.onPrimary,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  verification: {
    marginBottom: spacing.md,
  },
  matchHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.onPrimary,
    opacity: 0.88,
    textAlign: 'center',
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.display,
    color: colors.onAccent,
    marginBottom: spacing.xs,
  },
  duration: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  bodyText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  setupBanner: {
    marginBottom: spacing.sm,
  },
  messageButton: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '30%',
    minWidth: 0,
    paddingHorizontal: spacing.md,
  },
  bookButton: {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: '45%',
    minWidth: 0,
  },
});
}


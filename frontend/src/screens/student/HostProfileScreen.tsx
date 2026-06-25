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
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
} from '../../constants/theme';
import type { HostProfileSummary } from '../../types/booking';
import { formatCurrency } from '../../data/bookingMock';

export interface HostProfileScreenProps {
  host: HostProfileSummary;
  showMatchScores?: boolean;
  onMessagePress?: () => void;
  onBookPress?: () => void;
  onBack?: () => void;
}

export default function HostProfileScreen({
  host,
  showMatchScores = false,
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
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <View style={styles.heroContent}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{host.initials}</Text>
            </View>
          </View>
          <Text style={styles.hostName}>{host.name}</Text>
          <Text style={styles.hostLocation}>{host.location}</Text>
          {showMatchScores ? (
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{host.matchPercentage}% match</Text>
          </View>
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
          { paddingBottom: insets.bottom + 140 },
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

        <Text style={styles.sectionTitle}>About this host</Text>
        <Text style={styles.aboutText}>
          A welcoming family home with quiet study space, home-cooked meals, and
          a short commute to campus. Verified host with strong reviews from
          international students.
        </Text>

        <View style={styles.highlights}>
          {['Meals included', 'Study-friendly', 'Near campus'].map((label) => (
            <View key={label} style={styles.highlightChip}>
              <Text style={styles.highlightLabel}>{label}</Text>
            </View>
          ))}
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
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
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  hostName: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  hostLocation: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  matchBadge: {
    backgroundColor: colors.tealBright,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  matchBadgeText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  matchHint: {
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
    paddingHorizontal: spacing.lg,
  },
  priceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  priceLabel: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  priceValue: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  priceUnit: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  highlightIcon: {
    fontSize: fontSizes.body,
    marginRight: spacing.sm,
  },
  highlightLabel: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
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

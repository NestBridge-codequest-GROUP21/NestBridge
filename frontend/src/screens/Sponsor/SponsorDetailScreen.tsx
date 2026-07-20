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
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import type { SponsorListing } from '../../data/sponsorsMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  gradients,
  shadows,
} from '../../constants/theme';

export interface SponsorDetailScreenProps {
  sponsor: SponsorListing;
  onBack?: () => void;
  onApplyPress?: () => void;
  onSosPress?: () => void;
}

export default function SponsorDetailScreen({
  sponsor,
  onBack,
  onApplyPress,
}: SponsorDetailScreenProps) {
  const insets = useSafeAreaInsets();

  const details = [
    { label: 'Category', value: sponsor.category },
    { label: 'Max award', value: sponsor.amountLabel },
    { label: 'Eligibility', value: sponsor.eligibility },
    { label: 'Deadline', value: sponsor.deadline },
    { label: 'Duration', value: sponsor.duration },
    { label: 'Location', value: sponsor.location },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl * 4,
          paddingHorizontal: 0,
          paddingTop: 0,
        }}
      >
        <LinearGradient
          colors={[...gradients.headerCompact]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          <BackButton onPress={onBack} color={colors.white} style={styles.backBtn} />
          <View style={styles.logoTile}>
            <AppIcon glyph={sponsor.logo} size={32} color={colors.white} />
          </View>
          <Text style={styles.name}>{sponsor.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{sponsor.category}</Text>
          </View>
          <Text style={styles.amount}>{sponsor.amountLabel}</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this sponsor</Text>
          <Text style={styles.description}>
            {sponsor.description} {sponsor.aboutExtra}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsorship details</Text>
          {details.map((item) => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {sponsor.requirements.map((requirement) => (
            <View key={requirement} style={styles.requirementRow}>
              <AppIcon
                name="checkmark-circle"
                size={fontSizes.body}
                color={colors.teal}
                style={styles.bullet}
              />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Apply for sponsorship" onPress={onApplyPress} />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: spacing.xl,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  logoTile: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.navyMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
  },
  categoryBadge: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  categoryText: {
    fontFamily: fontFamilies.semibold,
    color: colors.white,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  amount: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.gold,
    marginTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  detailLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
    flex: 1,
    textAlign: 'right',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  requirementText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: lineHeights.caption,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});

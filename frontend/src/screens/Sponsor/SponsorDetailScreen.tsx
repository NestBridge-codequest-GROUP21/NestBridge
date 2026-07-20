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
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import type { SponsorListing } from '../../data/sponsorsMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  lineHeights,
  gradients,
  iconSizes,
  avatarSizes,
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
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


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
          paddingBottom: insets.bottom + layout.scrollBottomInset,
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
          <BackButton onPress={onBack} color={colors.onPrimary} style={styles.backBtn} />
          <View style={styles.logoTile}>
            <AppIcon
              glyph={sponsor.logo}
              size={iconSizes.xl}
              color={colors.onPrimary}
            />
          </View>
          <Text style={styles.name}>{sponsor.name}</Text>
          <StatusBadge label={sponsor.category} tone="accent" style={styles.categoryBadge} />
          <Text style={styles.amount}>{sponsor.amountLabel}</Text>
        </LinearGradient>

        <Card padding="lg" elevation="card" style={styles.section}>
          <SectionHeader title="About this sponsor" style={styles.sectionHeader} />
          <Text style={styles.description}>
            {sponsor.description} {sponsor.aboutExtra}
          </Text>
        </Card>

        <Card padding="lg" elevation="card" style={styles.section}>
          <SectionHeader title="Sponsorship details" style={styles.sectionHeader} />
          {details.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.detailRow,
                index === details.length - 1 && styles.detailRowLast,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        <Card padding="lg" elevation="card" style={styles.section}>
          <SectionHeader title="Requirements" style={styles.sectionHeader} />
          {sponsor.requirements.map((requirement) => (
            <View key={requirement} style={styles.requirementRow}>
              <AppIcon
                name="checkmark-circle"
                size={iconSizes.md}
                color={colors.teal}
                style={styles.bullet}
              />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <PrimaryButton label="Apply for sponsorship" onPress={onApplyPress} />
        </View>
      </ScreenScroll>
    </View>
  );
}

const LOGO_TILE = avatarSizes.lg + spacing.md;

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
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
    width: LOGO_TILE,
    height: LOGO_TILE,
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
    color: colors.onPrimary,
    textAlign: 'center',
  },
  categoryBadge: {
    marginTop: spacing.sm,
  },
  amount: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.heading,
    color: colors.gold,
    marginTop: spacing.sm,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  sectionHeader: {
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
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  detailRowLast: {
    borderBottomWidth: 0,
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
    marginTop: borderWidths.hairline,
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
}


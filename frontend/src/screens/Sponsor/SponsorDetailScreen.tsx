import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SosFloatingButton from '../../components/SosFloatingButton';
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
  onSosPress,
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

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl * 4,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <Pressable
            style={styles.backBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.logo}>{sponsor.logo}</Text>
          <Text style={styles.name}>{sponsor.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{sponsor.category}</Text>
          </View>
          <Text style={styles.amount}>{sponsor.amountLabel}</Text>
        </View>

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
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.applyBtn, pressed && styles.pressed]}
            onPress={onApplyPress}
            accessibilityRole="button"
            accessibilityLabel="Apply for sponsorship"
          >
            <Text style={styles.applyBtnText}>Apply for sponsorship</Text>
          </Pressable>
        </View>
      </ScrollView>

      <SosFloatingButton onPress={onSosPress} bottomOffset={spacing.md} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.navy,
    paddingBottom: spacing.xl,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backText: {
    fontFamily: fontFamilies.semibold,
    color: colors.tealBright,
    fontSize: fontSizes.body - 1,
    fontWeight: fontWeights.semibold,
  },
  logo: {
    fontSize: spacing.xl + spacing.lg,
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
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  categoryText: {
    fontFamily: fontFamilies.semibold,
    color: colors.white,
    fontSize: fontSizes.caption - 1,
    fontWeight: fontWeights.semibold,
  },
  amount: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display - 4,
    fontWeight: fontWeights.bold,
    color: colors.gold,
    marginTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: fontSizes.caption + 1,
    color: colors.textSecondary,
    lineHeight: lineHeights.subheading - 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  detailLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption + 1,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption + 1,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
    flex: 1,
    textAlign: 'right',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm + 2,
  },
  bullet: {
    fontFamily: fontFamilies.bold,
    color: colors.teal,
    fontWeight: fontWeights.bold,
    marginRight: spacing.sm + 2,
    fontSize: fontSizes.caption + 1,
  },
  requirementText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption + 1,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: lineHeights.caption + 4,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  applyBtn: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  pressed: {
    opacity: 0.88,
  },
});

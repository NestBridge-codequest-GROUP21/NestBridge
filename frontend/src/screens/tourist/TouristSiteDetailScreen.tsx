import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
} from '../../constants/theme';

export interface TouristSiteDetail {
  name: string;
  city: string;
  description: string;
  openingHours: string;
  admission: string;
}

export interface TouristSiteDetailScreenProps {
  site: TouristSiteDetail;
  onFindGuidePress?: () => void;
  onBack?: () => void;
}

export default function TouristSiteDetailScreen({
  site,
  onFindGuidePress,
  onBack,
}: TouristSiteDetailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl * 4 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imagePlaceholder} accessibilityLabel="Site photo placeholder" />

        <View style={styles.content}>
          <Text style={styles.name}>{site.name}</Text>
          <Text style={styles.city}>{site.city}</Text>

          <Text style={styles.description}>{site.description}</Text>

          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Opening hours</Text>
              <Text style={styles.detailValue}>{site.openingHours}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission</Text>
              <Text style={styles.detailValue}>{site.admission}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <PrimaryButton
          label="Find a guide for this site"
          onPress={onFindGuidePress}
        />
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
    flexGrow: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: layout.carouselMinHeight + spacing.xl,
    backgroundColor: colors.border,
  },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  name: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.display,
    marginBottom: spacing.xs,
  },
  city: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    lineHeight: lineHeights.subheading,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: layout.sectionGap,
  },
  sectionTitle: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  detailRow: {
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
  detailValue: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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
  },
});

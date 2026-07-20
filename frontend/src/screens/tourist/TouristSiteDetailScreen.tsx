import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenScroll from '../../components/ScreenScroll';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  iconSizes,
  avatarSizes,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <BackButton onPress={onBack} />
      </View>

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + layout.scrollBottomInsetWithSos,
        }}
      >
        <View style={styles.imagePlaceholder} accessibilityLabel="Site photo">
          <View style={styles.imageIconWrap}>
            <AppIcon
              name="library-outline"
              size={iconSizes.xl}
              color={colors.tealDeep}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{site.name}</Text>
          <Text style={styles.city}>{site.city}</Text>

          <Text style={styles.description}>{site.description}</Text>

          <SectionHeader title="Visit details" />
          <Card padding="md" elevation="card">
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Opening hours</Text>
              <Text style={styles.detailValue}>{site.openingHours}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission</Text>
              <Text style={styles.detailValue}>{site.admission}</Text>
            </View>
          </Card>
        </View>
      </ScreenScroll>

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

const ICON_TILE = avatarSizes.lg + spacing.md;

function createStyles({ colors, tints, shadows }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
  },
  imagePlaceholder: {
    width: '100%',
    height: layout.carouselMinHeight + spacing.xl,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconWrap: {
    width: ICON_TILE,
    height: ICON_TILE,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.display,
    marginBottom: spacing.xs,
  },
  city: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    lineHeight: lineHeights.subheading,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: layout.sectionGap,
  },
  detailRow: {
    gap: spacing.xs,
  },
  detailLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
  detailValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  detailDivider: {
    height: borderWidths.hairline,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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
});
}


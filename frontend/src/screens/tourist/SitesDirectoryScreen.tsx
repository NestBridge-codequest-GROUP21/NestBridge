import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  iconSizes,
  touchTarget,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

export interface SiteDirectoryItem {
  id: string;
  name: string;
  city: string;
  description: string;
  admission: string;
}

export interface SitesDirectoryScreenProps {
  cityLabel: string;
  sites: SiteDirectoryItem[];
  onSitePress?: (siteId: string) => void;
  onEmptyPrimaryAction?: () => void;
  onBack?: () => void;
}

export default function SitesDirectoryScreen({
  cityLabel,
  sites,
  onSitePress,
  onEmptyPrimaryAction,
  onBack,
}: SitesDirectoryScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.sitesDirectory(cityLabel);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Sites & culture"
        subtitle={`Heritage sites, markets, and must-sees near ${cityLabel}`}
        compact
        onBack={onBack}
      />

      <ScreenScroll>
        {sites.length === 0 ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : (
          sites.map((site) => (
            <Pressable
              key={site.id}
              style={({ pressed }) => [styles.cardWrap, pressed && styles.cardPressed]}
              onPress={() => onSitePress?.(site.id)}
              accessibilityRole="button"
              accessibilityLabel={site.name}
            >
              <Card padding="lg" elevation="card" style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleBlock}>
                    <Text style={styles.cardTitle}>{site.name}</Text>
                    <Text style={styles.cardCity}>{site.city}</Text>
                  </View>
                  <AppIcon
                    name="chevron-forward"
                    size={iconSizes.md}
                    color={colors.teal}
                  />
                </View>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {site.description}
                </Text>
                <Text style={styles.cardAdmission}>{site.admission}</Text>
              </Card>
            </Pressable>
          ))
        )}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cardWrap: {
    marginBottom: spacing.md,
    minHeight: touchTarget,
  },
  card: {
    minHeight: touchTarget,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardCity: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
  cardDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.sm,
  },
  cardAdmission: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
});
}


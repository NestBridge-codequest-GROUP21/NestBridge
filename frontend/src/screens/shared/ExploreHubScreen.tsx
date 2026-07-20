import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SectionHeader from '../../components/SectionHeader';
import Card from '../../components/Card';
import ListRow from '../../components/ListRow';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import AppIcon from '../../components/AppIcon';
import PrimaryButton from '../../components/PrimaryButton';
import type { ProfileHubItem } from '../../data/profileHub';
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
  touchTarget,
  avatarSizes,
} from '../../constants/theme';

export interface ExploreHubScreenProps {
  title?: string;
  subtitle?: string;
  /** Primary booking / search CTA (hosts, guides, lodging). */
  primaryActionLabel: string;
  primaryActionHint?: string;
  hubItems: ProfileHubItem[];
  /** Optional host/guide travel entry shown near the top. */
  travelBookingLabel?: string;
  travelBookingHint?: string;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onPrimaryActionPress?: () => void;
  onTravelBookingPress?: () => void;
  onHubItemPress?: (itemId: string) => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
}

export default function ExploreHubScreen({
  title = 'Explore',
  subtitle = 'Homestays, guides, culture, and support for life in Ghana',
  primaryActionLabel,
  primaryActionHint = 'Search hosts, guides, and places to stay',
  hubItems,
  travelBookingLabel,
  travelBookingHint,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  onPrimaryActionPress,
  onTravelBookingPress,
  onHubItemPress,
  onTabPress,
  onBack,
}: ExploreHubScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader title={title} subtitle={subtitle} compact onBack={onBack} />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        <Card padding="lg" elevation="raised" style={styles.heroCard}>
          <Text style={styles.heroTitle}>{primaryActionLabel}</Text>
          <Text style={styles.heroHint}>{primaryActionHint}</Text>
          <PrimaryButton label={primaryActionLabel} onPress={onPrimaryActionPress} />
        </Card>

        {travelBookingLabel ? (
          <Card padding="none" elevation="card" style={styles.travelCardOuter}>
            <ListRow
              title={travelBookingLabel}
              subtitle={
                travelBookingHint ?? 'Find a stay or guide for your own trip'
              }
              iconName="airplane-outline"
              onPress={onTravelBookingPress}
              bordered={false}
              style={styles.travelRow}
            />
          </Card>
        ) : null}

        <SectionHeader
          title="Guides for living in Ghana"
          style={styles.sectionHeader}
        />
        <Card padding="none" elevation="card" style={styles.groupCard}>
          {hubItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                style={({ pressed }) => [styles.hubRow, pressed && styles.pressed]}
                onPress={() => onHubItemPress?.(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.hubIcon}>
                  <AppIcon
                    glyph={item.icon}
                    size={iconSizes.md}
                    color={colors.tealDeep}
                  />
                </View>
                <View style={styles.hubText}>
                  <Text style={styles.hubTitle}>{item.label}</Text>
                  <Text style={styles.hubSubtitle}>{item.description}</Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={iconSizes.md}
                  color={colors.textTertiary}
                />
              </Pressable>
            </React.Fragment>
          ))}
        </Card>
      </ScreenScroll>

      <AppTabBar
        items={tabBarItems}
        activeTabId={activeTabId}
        showSosDock={showSosDock}
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroCard: {
    marginBottom: layout.sectionGap,
    gap: spacing.md,
  },
  heroTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.heading,
    color: colors.textPrimary,
  },
  heroHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  travelCardOuter: {
    marginBottom: layout.sectionGap,
    backgroundColor: tints.gold,
    borderColor: colors.gold,
    overflow: 'hidden',
  },
  travelRow: {
    paddingHorizontal: spacing.md,
    minHeight: touchTarget + spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  groupCard: {
    overflow: 'hidden',
  },
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: touchTarget + spacing.md,
    gap: spacing.md,
  },
  hubIcon: {
    width: avatarSizes.md,
    height: avatarSizes.md,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubText: {
    flex: 1,
  },
  hubTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hubSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  divider: {
    height: borderWidths.hairline,
    backgroundColor: colors.border,
    marginLeft: layout.screenPaddingHorizontal + avatarSizes.md,
  },
  pressed: {
    opacity: 0.92,
  },
});
}


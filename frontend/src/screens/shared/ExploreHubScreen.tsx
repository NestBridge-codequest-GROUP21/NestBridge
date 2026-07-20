import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import AppIcon from '../../components/AppIcon';
import PrimaryButton from '../../components/PrimaryButton';
import type { ProfileHubItem } from '../../data/profileHub';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  lineHeights,
  layout,
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
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader title={title} subtitle={subtitle} compact onBack={onBack} />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{primaryActionLabel}</Text>
          <Text style={styles.heroHint}>{primaryActionHint}</Text>
          <PrimaryButton label={primaryActionLabel} onPress={onPrimaryActionPress} />
        </View>

        {travelBookingLabel ? (
          <Pressable
            style={({ pressed }) => [styles.travelCard, pressed && styles.pressed]}
            onPress={onTravelBookingPress}
            accessibilityRole="button"
            accessibilityLabel={travelBookingLabel}
          >
            <View style={styles.travelIcon}>
              <AppIcon name="airplane-outline" size={22} color={colors.tealDeep} />
            </View>
            <View style={styles.travelText}>
              <Text style={styles.travelTitle}>{travelBookingLabel}</Text>
              <Text style={styles.travelHint}>
                {travelBookingHint ?? 'Find a stay or guide for your own trip'}
              </Text>
            </View>
            <AppIcon name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        ) : null}

        <Text style={styles.sectionLabel}>Guides for living in Ghana</Text>
        <View style={styles.groupCard}>
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
                  <AppIcon glyph={item.icon} size={20} color={colors.tealDeep} />
                </View>
                <View style={styles.hubText}>
                  <Text style={styles.hubTitle}>{item.label}</Text>
                  <Text style={styles.hubSubtitle}>{item.description}</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={colors.textTertiary} />
              </Pressable>
            </React.Fragment>
          ))}
        </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.raised,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  heroHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  travelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tints.gold,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: spacing.md,
    marginBottom: spacing.lg,
    minHeight: 72,
    gap: spacing.md,
    ...shadows.card,
  },
  travelIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelText: {
    flex: 1,
  },
  travelTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  travelHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
    gap: spacing.md,
  },
  hubIcon: {
    width: 40,
    height: 40,
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
    height: 1,
    backgroundColor: colors.border,
    marginLeft: layout.screenPaddingHorizontal + 40,
  },
  pressed: {
    opacity: 0.92,
  },
});

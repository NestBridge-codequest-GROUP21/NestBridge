import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import FeaturedHomeCard, {
  type FeaturedHomeCardProps,
} from '../../components/FeaturedHomeCard';
import QuickActionsGrid, {
  type QuickActionItem,
} from '../../components/QuickActionsGrid';
import ExploreSectionCarousel from '../../components/ExploreSectionCarousel';
import DiscoveryListingSection, {
  type DiscoveryListingItem,
} from '../../components/DiscoveryListingSection';
import RecentActivityList, {
  type RecentActivityItem,
} from '../../components/RecentActivityList';
import ReminderBanner from '../../components/ReminderBanner';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
} from '../../constants/theme';
import type { SuggestedHostItem } from '../student/StudentHomeDashboard';

export interface ExploreSectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  accent?: 'teal' | 'gold' | 'navy';
}

export interface ExploreHomeScreenProps {
  variant?: 'explore' | 'browse';
  greeting: string;
  userName: string;
  userInitials: string;
  cityLabel: string;
  statusIcon?: string;
  statusLabel?: string;
  notificationCount?: number;
  featuredGuide?: Omit<FeaturedHomeCardProps, 'onPress'>;
  quickActions: QuickActionItem[];
  sections: ExploreSectionItem[];
  exploreSectionTitle?: string;
  suggestedGuides?: DiscoveryListingItem[];
  suggestedGuidesTitle?: string;
  showMatchScores?: boolean;
  recentActivity?: RecentActivityItem[];
  reminder?: string;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  showSetupBanner?: boolean;
  onSetupPress?: () => void;
  onNotificationPress?: () => void;
  onFeaturedGuidePress?: () => void;
  onSuggestedGuidePress?: (guideId: string) => void;
  onSectionPress?: (sectionId: string) => void;
  onQuickActionPress?: (actionId: string) => void;
  onReminderPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function ExploreHomeScreen({
  variant = 'explore',
  greeting,
  userName,
  userInitials,
  cityLabel,
  statusIcon,
  statusLabel,
  notificationCount = 0,
  featuredGuide,
  quickActions,
  sections,
  exploreSectionTitle = 'Explore Accra',
  suggestedGuides = [],
  suggestedGuidesTitle = 'Top guides near you',
  showMatchScores = false,
  recentActivity = [],
  reminder,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  showSetupBanner = false,
  onSetupPress,
  onNotificationPress,
  onFeaturedGuidePress,
  onSuggestedGuidePress,
  onSectionPress,
  onQuickActionPress,
  onReminderPress,
  onTabPress,
}: ExploreHomeScreenProps) {
  const resolvedStatus =
    statusLabel ??
    (variant === 'browse' ? `Discover ${cityLabel}` : `Exploring ${cityLabel}`);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon ?? (variant === 'browse' ? '🔍' : '📍')}
        statusLabel={resolvedStatus}
        notificationCount={notificationCount}
        onNotificationPress={onNotificationPress}
      />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {showSetupBanner ? (
          <ProfileIncompleteBanner
            message="Add your travel dates and city to unlock booking in Ghana."
            onContinueSetup={onSetupPress}
          />
        ) : null}

        {featuredGuide ? (
          <FeaturedHomeCard
            {...featuredGuide}
            onPress={onFeaturedGuidePress}
          />
        ) : null}

        <QuickActionsGrid
          actions={quickActions}
          onActionPress={onQuickActionPress}
        />

        {suggestedGuides.length > 0 ? (
          <DiscoveryListingSection
            title={suggestedGuidesTitle}
            items={suggestedGuides}
            showMatchScores={showMatchScores}
            onItemPress={onSuggestedGuidePress}
          />
        ) : null}

        {sections.length > 0 ? (
          <View style={styles.carouselWrap}>
            <Text style={styles.sectionTitle}>{exploreSectionTitle}</Text>
            <ExploreSectionCarousel
              sections={sections}
              onSectionPress={onSectionPress}
            />
          </View>
        ) : null}

        <RecentActivityList items={recentActivity} />

        {reminder ? (
          <ReminderBanner message={reminder} onPress={onReminderPress} />
        ) : null}
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

export type { SuggestedHostItem };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselWrap: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});

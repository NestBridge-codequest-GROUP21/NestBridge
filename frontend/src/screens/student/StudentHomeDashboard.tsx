import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
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
import InlineBanner from '../../components/InlineBanner';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import SkeletonLoader from '../../components/SkeletonLoader';
import SectionHeader from '../../components/SectionHeader';
import {
  colors,
  spacing,
  layout,
} from '../../constants/theme';
import type { ExploreSectionItem } from '../tourist/ExploreHomeScreen';

export type { TabBarItem } from '../../components/AppTabBar';
export type { QuickActionItem } from '../../components/QuickActionsGrid';

export interface SuggestedHostItem {
  id: string;
  name: string;
  matchPercentage: number;
  location: string;
  pricePerNight: string;
  icon?: string;
}

export interface StudentHomeDashboardProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  notificationCount?: number;
  featuredMatch?: Omit<FeaturedHomeCardProps, 'onPress'>;
  quickActions: QuickActionItem[];
  recommendedSections?: ExploreSectionItem[];
  recommendedSectionTitle?: string;
  suggestedHosts?: SuggestedHostItem[];
  suggestedHostsTitle?: string;
  showMatchScores?: boolean;
  recentActivity?: RecentActivityItem[];
  reminder?: string;
  isHomeLoading?: boolean;
  homeDataError?: string | null;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  showSetupBanner?: boolean;
  onSetupPress?: () => void;
  onNotificationPress?: () => void;
  onFeaturedMatchPress?: () => void;
  onSuggestedHostPress?: (hostId: string) => void;
  onRecommendedSectionPress?: (sectionId: string) => void;
  onQuickActionPress?: (actionId: string) => void;
  onReminderPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function StudentHomeDashboard({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  notificationCount = 0,
  featuredMatch,
  quickActions,
  recommendedSections = [],
  recommendedSectionTitle = 'Prep before you arrive',
  suggestedHosts = [],
  suggestedHostsTitle = 'Suggested hosts',
  showMatchScores = false,
  recentActivity = [],
  reminder,
  isHomeLoading = false,
  homeDataError,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  showSetupBanner = false,
  onSetupPress,
  onNotificationPress,
  onFeaturedMatchPress,
  onSuggestedHostPress,
  onRecommendedSectionPress,
  onQuickActionPress,
  onReminderPress,
  onTabPress,
}: StudentHomeDashboardProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        notificationCount={notificationCount}
        onNotificationPress={onNotificationPress}
      />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {showSetupBanner ? (
          <ProfileIncompleteBanner
            message="Complete your travel profile to unlock homestay booking."
            onContinueSetup={onSetupPress}
          />
        ) : null}

        {isHomeLoading ? (
          <View
            style={styles.loadingWrap}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading your home"
          >
            <SkeletonLoader lines={3} style={styles.skeletonCard} />
            <SkeletonLoader lines={2} style={styles.skeletonCard} />
          </View>
        ) : null}

        {featuredMatch && !isHomeLoading ? (
          <FeaturedHomeCard
            {...featuredMatch}
            onPress={onFeaturedMatchPress}
          />
        ) : null}

        <QuickActionsGrid
          actions={quickActions}
          onActionPress={onQuickActionPress}
        />

        {suggestedHosts.length > 0 ? (
          <DiscoveryListingSection
            title={suggestedHostsTitle}
            items={suggestedHosts.map((host): DiscoveryListingItem => ({
              id: host.id,
              name: host.name,
              subtitle: host.location,
              priceLabel: host.pricePerNight,
              initials: host.name
                .split(/\s+/)
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
              matchPercentage: host.matchPercentage,
            }))}
            showMatchScores={showMatchScores}
            onItemPress={onSuggestedHostPress}
          />
        ) : null}

        {recommendedSections.length > 0 ? (
          <View style={styles.carouselSection}>
            <SectionHeader
              title={recommendedSectionTitle}
              style={styles.sectionHeader}
            />
            <ExploreSectionCarousel
              sections={recommendedSections}
              onSectionPress={onRecommendedSectionPress}
            />
          </View>
        ) : null}

        <RecentActivityList items={recentActivity} />

        {homeDataError ? (
          <View style={styles.bannerPad}>
            <InlineBanner message={homeDataError} tone="error" />
          </View>
        ) : reminder ? (
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselSection: {
    marginBottom: layout.sectionGap,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  loadingWrap: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    width: '100%',
  },
  bannerPad: {},
});

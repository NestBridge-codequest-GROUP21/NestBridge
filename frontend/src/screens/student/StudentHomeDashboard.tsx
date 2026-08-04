import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import FeaturedHomeCard, {
  type FeaturedHomeCardProps,
} from '../../components/FeaturedHomeCard';
import DiscoveryListingSection, {
  type DiscoveryListingItem,
} from '../../components/DiscoveryListingSection';
import RecommendedForYou from '../../components/RecommendedForYou';
import JourneyProgressCard from '../../components/JourneyProgressCard';
import RecentActivityList, {
  type RecentActivityItem,
} from '../../components/RecentActivityList';
import ReminderBanner from '../../components/ReminderBanner';
import SectionRetryBanner from '../../components/SectionRetryBanner';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  spacing,
  layout,
} from '../../constants/theme';
import type { RecommendationItem, RecommendationSection } from '../../types/recommendations';
import type { EmptyStateContent } from '../../data/appCopy';
import { emptyStates } from '../../data/appCopy';
import type { JourneyProgress } from '../../types/journeyProgress';

export type { TabBarItem } from '../../components/AppTabBar';

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
  /** Personalized destination-aware recommendations (slim nearby only). */
  recommendationSections?: RecommendationSection[];
  recommendationHeadline?: string;
  recommendationCity?: string;
  suggestedHosts?: SuggestedHostItem[];
  suggestedHostsTitle?: string;
  hostsEmptyState?: EmptyStateContent;
  showMatchScores?: boolean;
  journeyProgress?: JourneyProgress | null;
  recentActivity?: RecentActivityItem[];
  reminder?: string;
  isHomeLoading?: boolean;
  /** Fatal only — every home section failed. Partial failures use section props. */
  homeDataError?: string | null;
  hostsLoadError?: string | null;
  activityLoadError?: string | null;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  showSetupBanner?: boolean;
  onSetupPress?: () => void;
  onNotificationPress?: () => void;
  onFeaturedMatchPress?: () => void;
  onSuggestedHostPress?: (hostId: string) => void;
  onHostsEmptyPrimaryAction?: () => void;
  onRetryHosts?: () => void;
  onRetryActivity?: () => void;
  onRetryHome?: () => void;
  onRecommendationItemPress?: (item: RecommendationItem) => void;
  onRecommendationsEmptyPress?: () => void;
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
  recommendationSections = [],
  recommendationHeadline = 'Nearby for you',
  recommendationCity,
  suggestedHosts = [],
  suggestedHostsTitle = 'Homestays nearby',
  hostsEmptyState,
  showMatchScores = false,
  journeyProgress = null,
  recentActivity = [],
  reminder,
  isHomeLoading = false,
  homeDataError,
  hostsLoadError,
  activityLoadError,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  showSetupBanner = false,
  onSetupPress,
  onNotificationPress,
  onFeaturedMatchPress,
  onSuggestedHostPress,
  onHostsEmptyPrimaryAction,
  onRetryHosts,
  onRetryActivity,
  onRetryHome,
  onRecommendationItemPress,
  onRecommendationsEmptyPress,
  onReminderPress,
  onTabPress,
}: StudentHomeDashboardProps) {
  const styles = useThemedStyles(createStyles);

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
        {/* One status strip: setup first, else a single fatal retry — not a stack of banners. */}
        {showSetupBanner ? (
          <ProfileIncompleteBanner
            message="Complete your travel profile to unlock messaging, bookings, and personalized matches."
            continueLabel="Complete Profile"
            onContinueSetup={onSetupPress}
          />
        ) : homeDataError ? (
          <SectionRetryBanner
            message={homeDataError}
            onRetry={onRetryHome}
            retryLabel="Retry home"
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

        {journeyProgress && !showSetupBanner ? (
          <JourneyProgressCard journey={journeyProgress} />
        ) : null}

        {/* Keep host cards visible; soft section errors use empty state, not a second red banner. */}
        {!homeDataError && hostsLoadError && suggestedHosts.length === 0 ? (
          <SectionRetryBanner
            message={hostsLoadError}
            onRetry={onRetryHosts}
            retryLabel="Retry hosts"
          />
        ) : (
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
            emptyState={hostsEmptyState}
            onEmptyPrimaryAction={onHostsEmptyPrimaryAction}
            onItemPress={onSuggestedHostPress}
            actionLabel="See all"
            onActionPress={onHostsEmptyPrimaryAction}
          />
        )}

        {recommendationSections.some((section) => section.items.length > 0) ? (
          <RecommendedForYou
            headline={recommendationHeadline}
            city={recommendationCity}
            sections={recommendationSections}
            emptyState={emptyStates.recommendations}
            onEmptyPrimaryAction={onRecommendationsEmptyPress}
            onItemPress={onRecommendationItemPress}
          />
        ) : null}

        {!homeDataError && activityLoadError && recentActivity.length === 0 ? (
          <SectionRetryBanner
            message={activityLoadError}
            onRetry={onRetryActivity}
            retryLabel="Retry activity"
          />
        ) : (
          <RecentActivityList items={recentActivity} />
        )}

        {!homeDataError && !showSetupBanner && reminder ? (
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

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionBlock: {
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
});
}


import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
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
import type { SuggestedHostItem } from '../student/StudentHomeDashboard';
import type { RecommendationItem, RecommendationSection } from '../../types/recommendations';
import type { EmptyStateContent } from '../../data/appCopy';
import { emptyStates } from '../../data/appCopy';
import type { JourneyProgress, JourneyStep } from '../../types/journeyProgress';

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
  /** Kept for callers; site grids live on Sites / Explore hub. */
  sections?: ExploreSectionItem[];
  exploreSectionTitle?: string;
  suggestedGuides?: DiscoveryListingItem[];
  suggestedGuidesTitle?: string;
  guidesEmptyState?: EmptyStateContent;
  showMatchScores?: boolean;
  recommendationSections?: RecommendationSection[];
  recommendationHeadline?: string;
  journeyProgress?: JourneyProgress | null;
  recentActivity?: RecentActivityItem[];
  reminder?: string;
  /** Fatal only — every home section failed. */
  homeDataError?: string | null;
  guidesLoadError?: string | null;
  activityLoadError?: string | null;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  showSetupBanner?: boolean;
  onSetupPress?: () => void;
  onNotificationPress?: () => void;
  onFeaturedGuidePress?: () => void;
  onSuggestedGuidePress?: (guideId: string) => void;
  onGuidesEmptyPrimaryAction?: () => void;
  onRetryGuides?: () => void;
  onRetryActivity?: () => void;
  onRetryHome?: () => void;
  onSectionPress?: (sectionId: string) => void;
  onRecommendationItemPress?: (item: RecommendationItem) => void;
  onRecommendationsEmptyPress?: () => void;
  onJourneyStepPress?: (step: JourneyStep) => void;
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
  suggestedGuides = [],
  suggestedGuidesTitle = 'Guides nearby',
  guidesEmptyState,
  showMatchScores = false,
  recommendationSections = [],
  recommendationHeadline = 'Nearby for you',
  journeyProgress = null,
  recentActivity = [],
  reminder,
  homeDataError,
  guidesLoadError,
  activityLoadError,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  showSetupBanner = false,
  onSetupPress,
  onNotificationPress,
  onFeaturedGuidePress,
  onSuggestedGuidePress,
  onGuidesEmptyPrimaryAction,
  onRetryGuides,
  onRetryActivity,
  onRetryHome,
  onRecommendationItemPress,
  onRecommendationsEmptyPress,
  onJourneyStepPress,
  onQuickActionPress,
  onReminderPress,
  onTabPress,
}: ExploreHomeScreenProps) {
  const styles = useThemedStyles(createStyles);

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
        statusIcon={statusIcon ?? (variant === 'browse' ? 'search-outline' : 'location-outline')}
        statusLabel={resolvedStatus}
        notificationCount={notificationCount}
        onNotificationPress={onNotificationPress}
      />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {showSetupBanner ? (
          <ProfileIncompleteBanner
            message="Complete your travel profile to unlock messaging, bookings, and trip recommendations."
            continueLabel="Complete Profile"
            onContinueSetup={onSetupPress}
          />
        ) : null}

        {homeDataError ? (
          <SectionRetryBanner
            message={homeDataError}
            onRetry={onRetryHome}
            retryLabel="Retry home"
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

        {journeyProgress ? (
          <JourneyProgressCard
            journey={journeyProgress}
            onStepPress={onJourneyStepPress}
          />
        ) : null}

        {guidesLoadError ? (
          <SectionRetryBanner
            message={guidesLoadError}
            onRetry={onRetryGuides}
            retryLabel="Retry guides"
          />
        ) : (
          <DiscoveryListingSection
            title={suggestedGuidesTitle}
            items={suggestedGuides}
            showMatchScores={showMatchScores}
            emptyState={guidesEmptyState}
            onEmptyPrimaryAction={onGuidesEmptyPrimaryAction}
            onItemPress={onSuggestedGuidePress}
            actionLabel="See all"
            onActionPress={onGuidesEmptyPrimaryAction}
          />
        )}

        {recommendationSections.length > 0 ? (
          <RecommendedForYou
            headline={recommendationHeadline}
            city={cityLabel}
            sections={recommendationSections}
            emptyState={emptyStates.recommendations}
            onEmptyPrimaryAction={onRecommendationsEmptyPress}
            onItemPress={onRecommendationItemPress}
          />
        ) : null}

        {activityLoadError ? (
          <SectionRetryBanner
            message={activityLoadError}
            onRetry={onRetryActivity}
            retryLabel="Retry activity"
          />
        ) : (
          <RecentActivityList items={recentActivity} />
        )}

        {!homeDataError && reminder ? (
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

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
}


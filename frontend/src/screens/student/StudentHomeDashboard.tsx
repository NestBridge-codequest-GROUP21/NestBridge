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
import QuickActionsGrid, {
  type QuickActionItem,
} from '../../components/QuickActionsGrid';
import ExploreSectionList from '../../components/ExploreSectionList';
import DiscoveryListingSection, {
  type DiscoveryListingItem,
} from '../../components/DiscoveryListingSection';
import RecommendedForYou from '../../components/RecommendedForYou';
import JourneyProgressCard from '../../components/JourneyProgressCard';
import RecentActivityList, {
  type RecentActivityItem,
} from '../../components/RecentActivityList';
import ReminderBanner from '../../components/ReminderBanner';
import InlineBanner from '../../components/InlineBanner';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import SkeletonLoader from '../../components/SkeletonLoader';
import SectionHeader from '../../components/SectionHeader';
import {
  spacing,
  layout,
} from '../../constants/theme';
import type { ExploreSectionItem } from '../tourist/ExploreHomeScreen';
import type { RecommendationItem, RecommendationSection } from '../../types/recommendations';
import type { EmptyStateContent } from '../../data/appCopy';
import { emptyStates } from '../../data/appCopy';
import type { JourneyProgress, JourneyStep } from '../../types/journeyProgress';

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
  /** Personalized destination-aware recommendations. */
  recommendationSections?: RecommendationSection[];
  recommendationHeadline?: string;
  suggestedHosts?: SuggestedHostItem[];
  suggestedHostsTitle?: string;
  hostsEmptyState?: EmptyStateContent;
  showMatchScores?: boolean;
  journeyProgress?: JourneyProgress | null;
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
  onHostsEmptyPrimaryAction?: () => void;
  onRecommendedSectionPress?: (sectionId: string) => void;
  onRecommendationItemPress?: (item: RecommendationItem) => void;
  onRecommendationsEmptyPress?: () => void;
  onJourneyStepPress?: (step: JourneyStep) => void;
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
  recommendationSections = [],
  recommendationHeadline = 'Recommended for you',
  suggestedHosts = [],
  suggestedHostsTitle = 'Suggested hosts',
  hostsEmptyState,
  showMatchScores = false,
  journeyProgress = null,
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
  onHostsEmptyPrimaryAction,
  onRecommendedSectionPress,
  onRecommendationItemPress,
  onRecommendationsEmptyPress,
  onJourneyStepPress,
  onQuickActionPress,
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

        {journeyProgress ? (
          <JourneyProgressCard
            journey={journeyProgress}
            onStepPress={onJourneyStepPress}
          />
        ) : null}

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
        />

        <RecommendedForYou
          headline={recommendationHeadline}
          sections={recommendationSections}
          emptyState={emptyStates.recommendations}
          onEmptyPrimaryAction={onRecommendationsEmptyPress}
          onItemPress={onRecommendationItemPress}
        />

        {recommendedSections.length > 0 ? (
          <View style={styles.sectionBlock}>
            <SectionHeader
              title={recommendedSectionTitle}
              style={styles.sectionHeader}
            />
            <ExploreSectionList
              sections={recommendedSections}
              variant="grid"
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
  bannerPad: {},
});
}


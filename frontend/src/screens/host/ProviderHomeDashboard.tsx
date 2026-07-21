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
import HomeStatsCarousel, {
  type HomeStatItem,
} from '../../components/HomeStatsCarousel';
import ExploreSectionList from '../../components/ExploreSectionList';
import RecentActivityList, {
  type RecentActivityItem,
} from '../../components/RecentActivityList';
import ReminderBanner from '../../components/ReminderBanner';
import IncomingRequestCard from '../../components/IncomingRequestCard';
import { IncomingRequestsEmptyBlock } from '../../components/IncomingRequestCard';
import SectionHeader from '../../components/SectionHeader';
import RecommendedForYou from '../../components/RecommendedForYou';
import { emptyStates } from '../../data/appCopy';
import type { IncomingRequestsEmptyState } from './IncomingRequestsScreen';
import type { ExploreSectionItem } from '../tourist/ExploreHomeScreen';
import {
  spacing,
  layout,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';
import type { RecommendationItem, RecommendationSection } from '../../types/recommendations';

export type { TabBarItem } from '../../components/AppTabBar';

export interface ProviderHomeDashboardProps {
  providerRole: 'host' | 'guide';
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  notificationCount?: number;
  featuredCard?: Omit<FeaturedHomeCardProps, 'onPress'>;
  quickActions: QuickActionItem[];
  performanceStats?: HomeStatItem[];
  performanceTitle?: string;
  tourSuggestions?: ExploreSectionItem[];
  tourSuggestionsTitle?: string;
  recommendationSections?: RecommendationSection[];
  recommendationHeadline?: string;
  recommendationCity?: string;
  requests: IncomingBookingRequest[];
  emptyState?: IncomingRequestsEmptyState;
  onEmptyPrimaryAction?: () => void;
  recentActivity?: RecentActivityItem[];
  reminder?: string;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onNotificationPress?: () => void;
  onFeaturedPress?: () => void;
  onQuickActionPress?: (actionId: string) => void;
  onRequestPress?: (requestId: string) => void;
  onSeeAllRequestsPress?: () => void;
  onTourSuggestionPress?: (sectionId: string) => void;
  onRecommendationItemPress?: (item: RecommendationItem) => void;
  onRecommendationsEmptyPress?: () => void;
  onReminderPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function ProviderHomeDashboard({
  providerRole,
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  notificationCount = 0,
  featuredCard,
  quickActions,
  performanceStats = [],
  performanceTitle = 'Your listing performance',
  tourSuggestions = [],
  tourSuggestionsTitle = 'Suggested tour requests',
  recommendationSections = [],
  recommendationHeadline = 'Recommended for you',
  recommendationCity,
  requests,
  emptyState,
  onEmptyPrimaryAction,
  recentActivity = [],
  reminder,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  onNotificationPress,
  onFeaturedPress,
  onQuickActionPress,
  onRequestPress,
  onSeeAllRequestsPress,
  onTourSuggestionPress,
  onRecommendationItemPress,
  onRecommendationsEmptyPress,
  onReminderPress,
  onTabPress,
}: ProviderHomeDashboardProps) {
  const styles = useThemedStyles(createStyles);

  const secondaryRequests = featuredCard ? requests.slice(1) : requests;

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
        {featuredCard ? (
          <FeaturedHomeCard {...featuredCard} onPress={onFeaturedPress} />
        ) : null}

        {requests.length === 0 && emptyState ? (
          <IncomingRequestsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconGlyph={emptyState.iconGlyph}
            primaryActionLabel={emptyState.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : null}

        <QuickActionsGrid
          actions={quickActions}
          onActionPress={onQuickActionPress}
        />

        <RecommendedForYou
          headline={recommendationHeadline}
          city={recommendationCity}
          sections={recommendationSections}
          emptyState={emptyStates.recommendations}
          onEmptyPrimaryAction={onRecommendationsEmptyPress}
          onItemPress={onRecommendationItemPress}
        />

        {performanceStats.length > 0 ? (
          <HomeStatsCarousel title={performanceTitle} items={performanceStats} />
        ) : null}

        {providerRole === 'guide' && tourSuggestions.length > 0 ? (
          <View style={styles.sectionWrap}>
            <SectionHeader title={tourSuggestionsTitle} />
            <ExploreSectionList
              sections={tourSuggestions}
              variant="grid"
              onSectionPress={onTourSuggestionPress}
            />
          </View>
        ) : null}

        {secondaryRequests.length > 0 ? (
          <View style={styles.requestsSection}>
            <SectionHeader
              title="More requests"
              actionLabel="View all"
              onActionPress={onSeeAllRequestsPress}
            />
            {secondaryRequests.map((request, index) => (
              <IncomingRequestCard
                key={request.id}
                request={request}
                isLast={index === secondaryRequests.length - 1}
                onPress={onRequestPress}
              />
            ))}
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

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionWrap: {
    marginBottom: layout.sectionGap,
  },
  requestsSection: {
    marginBottom: layout.sectionGap,
  },
});
}


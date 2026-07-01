import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import ExploreSectionCarousel from '../../components/ExploreSectionCarousel';
import RecentActivityList, {
  type RecentActivityItem,
} from '../../components/RecentActivityList';
import ReminderBanner from '../../components/ReminderBanner';
import IncomingRequestCard from '../../components/IncomingRequestCard';
import { IncomingRequestsEmptyBlock } from '../../components/IncomingRequestCard';
import type { IncomingRequestsEmptyState } from './IncomingRequestsScreen';
import type { ExploreSectionItem } from '../tourist/ExploreHomeScreen';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';

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
  requests: IncomingBookingRequest[];
  emptyState?: IncomingRequestsEmptyState;
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
  requests,
  emptyState,
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
  onReminderPress,
  onTabPress,
}: ProviderHomeDashboardProps) {
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
          />
        ) : null}

        <QuickActionsGrid
          actions={quickActions}
          onActionPress={onQuickActionPress}
        />

        {providerRole === 'host' && performanceStats.length > 0 ? (
          <HomeStatsCarousel title={performanceTitle} items={performanceStats} />
        ) : null}

        {providerRole === 'guide' && tourSuggestions.length > 0 ? (
          <View style={styles.carouselWrap}>
            <Text style={styles.sectionTitle}>{tourSuggestionsTitle}</Text>
            <ExploreSectionCarousel
              sections={tourSuggestions}
              onSectionPress={onTourSuggestionPress}
            />
          </View>
        ) : null}

        {secondaryRequests.length > 0 ? (
          <View style={styles.requestsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleInline}>More requests</Text>
              <Pressable
                onPress={onSeeAllRequestsPress}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="See all requests"
              >
                <Text style={styles.seeAll}>View all</Text>
              </Pressable>
            </View>
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
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  requestsSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitleInline: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});

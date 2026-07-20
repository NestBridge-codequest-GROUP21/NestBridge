import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SectionHeader from '../../components/SectionHeader';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
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
import {
  spacing,
  layout,
} from '../../constants/theme';
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
  sections: ExploreSectionItem[];
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
  sections,
  exploreSectionTitle = 'Explore Accra',
  suggestedGuides = [],
  suggestedGuidesTitle = 'Recommended nearby',
  guidesEmptyState,
  showMatchScores = false,
  recommendationSections = [],
  recommendationHeadline = 'Recommended for you',
  journeyProgress = null,
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
  onGuidesEmptyPrimaryAction,
  onSectionPress,
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

        {journeyProgress ? (
          <JourneyProgressCard
            journey={journeyProgress}
            onStepPress={onJourneyStepPress}
          />
        ) : null}

        <DiscoveryListingSection
          title={suggestedGuidesTitle}
          items={suggestedGuides}
          showMatchScores={showMatchScores}
          emptyState={guidesEmptyState}
          onEmptyPrimaryAction={onGuidesEmptyPrimaryAction}
          onItemPress={onSuggestedGuidePress}
        />

        <RecommendedForYou
          headline={recommendationHeadline}
          city={cityLabel}
          sections={recommendationSections}
          emptyState={emptyStates.recommendations}
          onEmptyPrimaryAction={onRecommendationsEmptyPress}
          onItemPress={onRecommendationItemPress}
        />

        {sections.length > 0 ? (
          <View style={styles.sectionWrap}>
            <SectionHeader
              title={exploreSectionTitle}
              style={styles.sectionHeader}
            />
            <ExploreSectionList
              sections={sections}
              variant="grid"
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

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionWrap: {
    marginBottom: layout.sectionGap,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
});
}


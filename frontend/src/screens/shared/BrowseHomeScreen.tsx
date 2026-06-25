import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import ExploreSectionCarousel from '../../components/ExploreSectionCarousel';
import DiscoveryListingSection from '../../components/DiscoveryListingSection';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import { browseGateCopy } from '../../data/appCopy';
import { colors } from '../../constants/theme';
import type { GuideProfileSummary } from '../../types/booking';
import type { SuggestedHostItem } from '../student/StudentHomeDashboard';
import type { ExploreSectionItem } from '../tourist/ExploreHomeScreen';
import { formatCurrency } from '../../data/bookingMock';

export interface BrowseHomeScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  cityLabel: string;
  sections: ExploreSectionItem[];
  suggestedGuides: GuideProfileSummary[];
  suggestedHosts: SuggestedHostItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSetupBanner?: boolean;
  showMatchScores?: boolean;
  guidesEmptyState?: { title: string; body: string };
  hostsEmptyState?: { title: string; body: string };
  onSetupPress?: () => void;
  onSectionPress?: (sectionId: string) => void;
  onGuidePress?: (guideId: string) => void;
  onHostPress?: (hostId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function BrowseHomeScreen({
  greeting,
  userName,
  userInitials,
  cityLabel,
  sections,
  suggestedGuides,
  suggestedHosts,
  tabBarItems,
  activeTabId,
  showSetupBanner = false,
  showMatchScores = false,
  guidesEmptyState,
  hostsEmptyState,
  onSetupPress,
  onSectionPress,
  onGuidePress,
  onHostPress,
  onTabPress,
}: BrowseHomeScreenProps) {
  const guidesHeading = showMatchScores
    ? 'Suggested guides'
    : `Popular guides in ${cityLabel}`;
  const hostsHeading = showMatchScores
    ? 'Suggested homestays'
    : `Popular stays in ${cityLabel}`;

  const guideItems = useMemo(
    () =>
      suggestedGuides.map((guide) => ({
        id: guide.id,
        name: guide.name,
        subtitle: guide.location,
        priceLabel: `${formatCurrency(guide.pricePerSession, guide.currency)}/session`,
        initials: guide.initials,
        matchPercentage: guide.matchPercentage,
      })),
    [suggestedGuides],
  );

  const hostItems = useMemo(
    () =>
      suggestedHosts.map((host) => ({
        id: host.id,
        name: host.name,
        subtitle: host.location,
        priceLabel: host.pricePerNight,
        initials: host.name.slice(0, 2).toUpperCase(),
        matchPercentage: host.matchPercentage,
      })),
    [suggestedHosts],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        subtitle={`Discover ${cityLabel}`}
      />

      <ScreenScroll withTabBar>
        {showSetupBanner ? (
          <ProfileIncompleteBanner
            message={browseGateCopy.message}
            continueLabel={browseGateCopy.continueLabel}
            onContinueSetup={onSetupPress}
          />
        ) : null}

        <ExploreSectionCarousel
          sections={sections}
          onSectionPress={onSectionPress}
        />

        <DiscoveryListingSection
          title={guidesHeading}
          items={guideItems}
          showMatchScores={showMatchScores}
          emptyState={guidesEmptyState}
          onItemPress={onGuidePress}
        />

        <DiscoveryListingSection
          title={hostsHeading}
          items={hostItems}
          showMatchScores={showMatchScores}
          emptyState={hostsEmptyState}
          onItemPress={onHostPress}
        />
      </ScreenScroll>

      <AppTabBar items={tabBarItems} activeTabId={activeTabId} onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

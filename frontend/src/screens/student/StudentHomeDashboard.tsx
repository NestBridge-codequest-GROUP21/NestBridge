import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
} from '../../constants/theme';

export interface QuickActionItem {
  id: string;
  label: string;
  icon?: string;
}

export interface SuggestedHostItem {
  id: string;
  name: string;
  matchPercentage: number;
  location: string;
  pricePerNight: string;
  icon?: string;
}

export interface MatchAlertData {
  count: number;
  subtitle: string;
}

export type { TabBarItem } from '../../components/AppTabBar';

export interface StudentHomeDashboardProps {
  greeting: string;
  userName: string;
  userInitials: string;
  searchPlaceholder: string;
  matchAlert: MatchAlertData;
  quickActions: QuickActionItem[];
  suggestedHosts: SuggestedHostItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showMatchScores?: boolean;
  hostsSectionTitle?: string;
  onSearchPress?: () => void;
  onMatchAlertPress?: () => void;
  onSeeAllHostsPress?: () => void;
  onHostPress?: (hostId: string) => void;
  onQuickActionPress?: (actionId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function StudentHomeDashboard({
  greeting,
  userName,
  userInitials,
  searchPlaceholder,
  matchAlert,
  quickActions,
  suggestedHosts,
  tabBarItems,
  activeTabId,
  showMatchScores = false,
  hostsSectionTitle = 'Suggested hosts',
  onSearchPress,
  onMatchAlertPress,
  onSeeAllHostsPress,
  onHostPress,
  onQuickActionPress,
  onTabPress,
}: StudentHomeDashboardProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.header]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.avatar} accessibilityLabel={`${userName} profile`}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.searchBar, pressed && styles.searchBarPressed]}
          onPress={onSearchPress}
          accessibilityRole="search"
          accessibilityLabel={searchPlaceholder}
        >
          <Text style={styles.searchLabel}>Search</Text>
          <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + layout.scrollBottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {showMatchScores && matchAlert.count > 0 ? (
        <Pressable
          style={({ pressed }) => [styles.matchCard, pressed && styles.cardPressed]}
          onPress={onMatchAlertPress}
          accessibilityRole="button"
          accessibilityLabel={`${matchAlert.count} new matches. ${matchAlert.subtitle}`}
        >
          <View style={styles.matchAccent} />
          <View style={styles.matchBody}>
            <View style={styles.matchTextBlock}>
              <Text style={styles.matchCount}>{matchAlert.count} new matches</Text>
              <Text style={styles.matchSubtitle}>{matchAlert.subtitle}</Text>
            </View>
            <View style={styles.matchCta}>
              <Text style={styles.matchCtaText}>View</Text>
            </View>
          </View>
        </Pressable>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.quickActionItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => onQuickActionPress?.(action.id)}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <View style={styles.quickActionIconWrap}>
                  <Text style={styles.quickActionInitial}>
                    {action.icon ?? action.label.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleInline}>{hostsSectionTitle}</Text>
            <Pressable
              onPress={onSeeAllHostsPress}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="See all suggested hosts"
            >
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          {suggestedHosts.map((host, index) => (
            <Pressable
              key={host.id}
              style={({ pressed }) => [
                styles.hostCard,
                index < suggestedHosts.length - 1 && styles.hostCardSpacing,
                pressed && styles.cardPressed,
              ]}
              onPress={() => onHostPress?.(host.id)}
              accessibilityRole="button"
              accessibilityLabel={`${host.name}, ${host.matchPercentage} percent match, ${host.location}, ${host.pricePerNight}`}
            >
              <View style={styles.hostIconWrap}>
                <Text style={styles.hostIconInitial}>
                  {host.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={styles.hostDetails}>
                <View style={styles.hostTitleRow}>
                  <Text style={styles.hostName} numberOfLines={1}>
                    {host.name}
                  </Text>
                  {showMatchScores ? (
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>{host.matchPercentage}%</Text>
                  </View>
                  ) : null}
                </View>
                <Text style={styles.hostLocation} numberOfLines={1}>
                  {host.location}
                </Text>
                <Text style={styles.hostPrice}>{host.pricePerNight}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AppTabBar items={tabBarItems} activeTabId={activeTabId} onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg + spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greeting: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    marginBottom: spacing.xs,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    minHeight: 48,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBarPressed: {
    opacity: 0.92,
  },
  searchLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  matchAccent: {
    width: 4,
    backgroundColor: colors.tealBright,
  },
  matchBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  matchTextBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  matchCount: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  matchSubtitle: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  matchCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    minHeight: 44,
  },
  matchCtaText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    marginRight: spacing.xs,
  },
  matchCtaArrow: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionTitleInline: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: -spacing.sm,
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    minHeight: 88,
  },
  quickActionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionInitial: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    color: colors.tealDeep,
  },
  quickActionLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  hostCardSpacing: {
    marginBottom: spacing.sm,
  },
  hostIconWrap: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hostIconInitial: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.tealDeep,
  },
  hostDetails: {
    flex: 1,
  },
  hostTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  hostName: {
    flex: 1,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  matchBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  matchBadgeText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  hostLocation: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  hostPrice: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.navyMid,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: spacing.xs,
  },
  tabIconWrap: {
    position: 'relative',
    marginBottom: spacing.xs,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.55,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.55,
  },
  tabLabelActive: {
    fontWeight: fontWeights.semibold,
    opacity: 1,
  },
});

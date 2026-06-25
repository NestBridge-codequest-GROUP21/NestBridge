import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import IncomingRequestCard, {
  IncomingRequestsEmptyBlock,
} from '../../components/IncomingRequestCard';
import type { IncomingRequestsEmptyState } from './IncomingRequestsScreen';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
  lineHeights,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';

export type { TabBarItem } from '../../components/AppTabBar';

export interface ProviderHomeDashboardProps {
  greeting: string;
  userName: string;
  userInitials: string;
  welcomeLine: string;
  requestsTitle: string;
  requestsSubtitle: string;
  requests: IncomingBookingRequest[];
  emptyState?: IncomingRequestsEmptyState;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  onRequestPress?: (requestId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function ProviderHomeDashboard({
  greeting,
  userName,
  userInitials,
  welcomeLine,
  requestsTitle,
  requestsSubtitle,
  requests,
  emptyState,
  tabBarItems,
  activeTabId,
  onRequestPress,
  onTabPress,
}: ProviderHomeDashboardProps) {
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

        <Text style={styles.welcomeLine}>{welcomeLine}</Text>

        <View style={styles.requestsHeader}>
          <Text style={styles.requestsTitle}>{requestsTitle}</Text>
          <Text style={styles.requestsSubtitle}>{requestsSubtitle}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + layout.scrollBottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {requests.length === 0 && emptyState ? (
          <IncomingRequestsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
          />
        ) : null}

        {requests.map((request, index) => (
          <IncomingRequestCard
            key={request.id}
            request={request}
            isLast={index === requests.length - 1}
            onPress={onRequestPress}
          />
        ))}
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
    paddingBottom: spacing.lg,
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
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  welcomeLine: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  requestsHeader: {
    borderTopWidth: 1,
    borderTopColor: colors.white,
    paddingTop: spacing.md,
  },
  requestsTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  requestsSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
});

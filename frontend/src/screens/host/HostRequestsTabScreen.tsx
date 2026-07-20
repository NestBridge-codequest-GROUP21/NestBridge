import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import IncomingRequestCard, {
  IncomingRequestsEmptyBlock,
} from '../../components/IncomingRequestCard';
import InlineBanner from '../../components/InlineBanner';
import {
  colors,
  spacing,
  borderRadius,
} from '../../constants/theme';
import type { IncomingBookingRequest } from '../../types/booking';

export interface HostRequestsTabScreenProps {
  userName: string;
  userInitials: string;
  requests: IncomingBookingRequest[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: { title: string; body: string; tip?: string };
  onRequestPress?: (requestId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function HostRequestsTabScreen({
  userName,
  userInitials,
  requests,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  isLoading = false,
  errorMessage,
  emptyState,
  onRequestPress,
  onTabPress,
}: HostRequestsTabScreenProps) {
  const pendingLabel =
    requests.length === 1 ? '1 pending request' : `${requests.length} pending requests`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Requests"
        userName={userName}
        userInitials={userInitials}
        subtitle={pendingLabel}
        compact
      />
      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {errorMessage ? (
          <InlineBanner message={errorMessage} tone="error" />
        ) : null}
        {isLoading ? (
          <View
            style={styles.loadingWrap}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading requests"
          >
            <View style={styles.loadingTile}>
              <ActivityIndicator size="large" color={colors.teal} />
            </View>
          </View>
        ) : null}
        {!isLoading && requests.length === 0 ? (
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
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingTile: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

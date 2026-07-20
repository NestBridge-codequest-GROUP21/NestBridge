import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import ProviderBookingCard, {
  ProviderBookingsEmptyBlock,
} from '../../components/ProviderBookingCard';
import InlineBanner from '../../components/InlineBanner';
import {
  colors,
  spacing,
  borderRadius,
} from '../../constants/theme';
import type { ProviderBookingItem } from '../../types/providerBooking';

export interface GuideBookingsTabScreenProps {
  userName: string;
  userInitials: string;
  bookings: ProviderBookingItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: { title: string; body: string; tip?: string };
  onBookingPress?: (bookingId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function GuideBookingsTabScreen({
  userName,
  userInitials,
  bookings,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  isLoading = false,
  errorMessage,
  emptyState,
  onBookingPress,
  onTabPress,
}: GuideBookingsTabScreenProps) {
  const subtitle =
    bookings.length === 1 ? '1 upcoming tour' : `${bookings.length} upcoming tours`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Bookings"
        userName={userName}
        userInitials={userInitials}
        subtitle={subtitle}
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
            accessibilityLabel="Loading bookings"
          >
            <View style={styles.loadingTile}>
              <ActivityIndicator size="large" color={colors.teal} />
            </View>
          </View>
        ) : null}
        {!isLoading && bookings.length === 0 ? (
          <ProviderBookingsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
          />
        ) : null}
        {bookings.map((booking, index) => (
          <ProviderBookingCard
            key={booking.id}
            booking={booking}
            isLast={index === bookings.length - 1}
            onPress={onBookingPress}
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

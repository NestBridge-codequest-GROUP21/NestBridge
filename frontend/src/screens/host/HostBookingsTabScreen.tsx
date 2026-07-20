import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import ProviderBookingCard, {
  ProviderBookingsEmptyBlock,
} from '../../components/ProviderBookingCard';
import InlineBanner from '../../components/InlineBanner';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  spacing,
} from '../../constants/theme';
import type { EmptyStateContent } from '../../data/appCopy';
import type { ProviderBookingItem } from '../../types/providerBooking';

export interface HostBookingsTabScreenProps {
  userName: string;
  userInitials: string;
  bookings: ProviderBookingItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: EmptyStateContent;
  onEmptyPrimaryAction?: () => void;
  onBookingPress?: (bookingId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function HostBookingsTabScreen({
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
  onEmptyPrimaryAction,
  onBookingPress,
  onTabPress,
}: HostBookingsTabScreenProps) {
  const styles = useThemedStyles(createStyles);

  const subtitle =
    bookings.length === 1
      ? '1 confirmed guest stay'
      : `${bookings.length} confirmed guest stays`;

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
          <View accessibilityRole="progressbar" accessibilityLabel="Loading bookings">
            <SkeletonLoader lines={2} style={styles.skeleton} />
            <SkeletonLoader lines={2} style={styles.skeleton} />
          </View>
        ) : null}
        {!isLoading && bookings.length === 0 ? (
          <ProviderBookingsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconGlyph={emptyState.iconGlyph}
            primaryActionLabel={emptyState.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : null}
        {!isLoading
          ? bookings.map((booking, index) => (
              <ProviderBookingCard
                key={booking.id}
                booking={booking}
                isLast={index === bookings.length - 1}
                onPress={onBookingPress}
              />
            ))
          : null}
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
  skeleton: {
    marginBottom: spacing.md,
  },
});
}


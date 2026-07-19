import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import { ProviderBookingsEmptyBlock } from '../../components/ProviderBookingCard';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';
import { formatCurrency } from '../../data/bookingMock';
import type { EarningsLineItem, EarningsSummary } from '../../types/providerBooking';

export interface GuideEarningsTabScreenProps {
  userName: string;
  userInitials: string;
  summary: EarningsSummary;
  lineItems: EarningsLineItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: { title: string; body: string; tip?: string };
  onTabPress?: (tabId: string) => void;
}

export default function GuideEarningsTabScreen({
  userName,
  userInitials,
  summary,
  lineItems,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  isLoading = false,
  errorMessage,
  emptyState,
  onTabPress,
}: GuideEarningsTabScreenProps) {
  const hasEarnings = lineItems.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Earnings"
        userName={userName}
        userInitials={userInitials}
        subtitle={summary.periodLabel}
        compact
      />
      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}
        {!isLoading && hasEarnings ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net payout</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.netPayout, summary.currency)}
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.metaLabel}>Gross</Text>
                <Text style={styles.metaValue}>
                  {formatCurrency(summary.grossTotal, summary.currency)}
                </Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.metaLabel}>Platform fees</Text>
                <Text style={styles.metaValue}>
                  {formatCurrency(summary.platformFees, summary.currency)}
                </Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.metaLabel}>Tours</Text>
                <Text style={styles.metaValue}>{summary.sessionCount}</Text>
              </View>
            </View>
          </View>
        ) : null}
        {!isLoading && !hasEarnings ? (
          <ProviderBookingsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
          />
        ) : null}
        {lineItems.map((item) => (
          <View key={item.id} style={styles.lineItem}>
            <View style={styles.lineTop}>
              <Text style={styles.lineGuest}>{item.guestName}</Text>
              <Text style={styles.lineNet}>{formatCurrency(item.net, item.currency)}</Text>
            </View>
            <Text style={styles.lineLabel}>{item.label}</Text>
            <Text style={styles.lineFee}>
              Fee {formatCurrency(item.fee, item.currency)} · Gross{' '}
              {formatCurrency(item.gross, item.currency)}
            </Text>
          </View>
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
  loader: {
    marginVertical: spacing.xl,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.teal,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCol: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  metaValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  lineItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lineGuest: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  lineNet: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  lineLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lineFee: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
});

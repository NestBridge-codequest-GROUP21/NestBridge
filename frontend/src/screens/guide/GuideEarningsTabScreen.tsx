import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import SectionHeader from '../../components/SectionHeader';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
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
        {errorMessage ? (
          <InlineBanner message={errorMessage} tone="error" />
        ) : null}
        {isLoading ? (
          <View accessibilityRole="progressbar" accessibilityLabel="Loading earnings">
            <SkeletonLoader lines={3} style={styles.skeleton} />
            <SkeletonLoader lines={2} style={styles.skeleton} />
          </View>
        ) : null}
        {!isLoading && hasEarnings ? (
          <Card padding="lg" style={styles.summaryCard}>
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
          </Card>
        ) : null}
        {!isLoading && !hasEarnings ? (
          <EmptyState
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconName="cash-outline"
          />
        ) : null}
        {!isLoading && hasEarnings ? (
          <SectionHeader title="Payout history" />
        ) : null}
        {!isLoading
          ? lineItems.map((item) => (
              <Card key={item.id} padding="lg" style={styles.lineItem}>
                <View style={styles.lineTop}>
                  <Text style={styles.lineGuest}>{item.guestName}</Text>
                  <Text style={styles.lineNet}>
                    {formatCurrency(item.net, item.currency)}
                  </Text>
                </View>
                <Text style={styles.lineLabel}>{item.label}</Text>
                <Text style={styles.lineFee}>
                  Gross {formatCurrency(item.gross, item.currency)} · Fee{' '}
                  {formatCurrency(item.fee, item.currency)}
                </Text>
              </Card>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skeleton: {
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
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
    fontWeight: fontWeights.regular,
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
    marginBottom: spacing.md,
  },
  lineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lineGuest: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: spacing.md,
  },
  lineNet: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  lineLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lineFee: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
});

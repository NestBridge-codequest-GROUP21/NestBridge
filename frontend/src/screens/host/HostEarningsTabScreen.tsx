import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
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

export interface HostEarningsTabScreenProps {
  userName: string;
  userInitials: string;
  summary: EarningsSummary;
  lineItems: EarningsLineItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: { title: string; body: string; tip?: string };
  showSosDock?: boolean;
  onSosPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function HostEarningsTabScreen({
  userName,
  userInitials,
  summary,
  lineItems,
  tabBarItems,
  activeTabId,
  isLoading = false,
  errorMessage,
  emptyState,
  showSosDock = false,
  onSosPress,
  onTabPress,
}: HostEarningsTabScreenProps) {
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
        <View style={styles.escrowCard}>
          <Text style={styles.escrowTitle}>Held in escrow</Text>
          <Text style={styles.escrowBody}>
            Guest payments stay in escrow until 24 hours after check-in. Payouts
            move here once stays are confirmed.
          </Text>
        </View>

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
                <Text style={styles.metaLabel}>Stays</Text>
                <Text style={styles.metaValue}>{summary.sessionCount}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {!isLoading && !hasEarnings ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{emptyState.title}</Text>
            <Text style={styles.emptyBody}>{emptyState.body}</Text>
            {emptyState.tip ? (
              <Text style={styles.emptyTip}>{emptyState.tip}</Text>
            ) : null}
          </View>
        ) : null}

        {lineItems.map((item) => (
          <View key={item.id} style={styles.lineItem}>
            <View style={styles.lineItemHeader}>
              <Text style={styles.lineGuest}>{item.guestName}</Text>
              <Text style={styles.lineNet}>
                {formatCurrency(item.net, item.currency)}
              </Text>
            </View>
            <Text style={styles.lineLabel}>{item.label}</Text>
            <Text style={styles.lineMeta}>
              Gross {formatCurrency(item.gross, item.currency)} · Fee{' '}
              {formatCurrency(item.fee, item.currency)}
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
  escrowCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  escrowTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  escrowBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
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
    justifyContent: 'space-between',
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
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  emptyTip: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  lineItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  lineItemHeader: {
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
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lineMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
});

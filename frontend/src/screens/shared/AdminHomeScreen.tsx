import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import InlineBanner from '../../components/InlineBanner';
import EmptyState from '../../components/EmptyState';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import type {
  AdminBookingActivity,
  AdminOverview,
  AdminSosActivity,
} from '../../services/api';
import type { StaffUserCategory } from './StaffUserSearchScreen';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  borderRadius,
  touchTarget,
  iconSizes,
  borderWidths,
} from '../../constants/theme';

export interface AdminHomeScreenProps {
  staffName: string;
  overview: AdminOverview | null;
  isLoading?: boolean;
  refreshing?: boolean;
  errorMessage?: string | null;
  tabBarItems: TabBarItem[];
  onTabPress?: (tabId: string) => void;
  onRefresh?: () => void;
  onOpenUsers?: () => void;
  onOpenUsersByCategory?: (category: StaffUserCategory) => void;
  onOpenPendingKyc?: () => void;
  onOpenModeration?: () => void;
  onOpenPreview?: () => void;
  onOpenProfile?: () => void;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

function StatTile({
  label,
  value,
  tone,
  onPress,
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const interactive = Boolean(onPress);
  const content = (
    <>
      <View style={styles.statTopRow}>
        <Text style={[styles.statValue, !interactive && styles.statValueReadOnly]}>
          {value}
        </Text>
        {interactive ? (
          <AppIcon name="chevron-forward" size={iconSizes.sm} color={colors.teal} />
        ) : null}
      </View>
      <Text style={[styles.statLabel, !interactive && styles.statLabelReadOnly]}>
        {label}
      </Text>
      {interactive ? <Text style={styles.statHint}>Tap to open</Text> : null}
    </>
  );
  const tileStyle = [
    interactive ? styles.statTileInteractive : styles.statTileReadOnly,
    tone === 'danger' && styles.statDanger,
    tone === 'warning' && styles.statWarning,
    tone === 'success' && styles.statSuccess,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...tileStyle, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${label}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={tileStyle}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      {content}
    </View>
  );
}

function formatBookingLine(item: AdminBookingActivity): string {
  return `${item.bookingType} · ${item.status}`;
}

function formatSosLine(item: AdminSosActivity): string {
  const when = item.triggeredAt ? new Date(item.triggeredAt).toLocaleString() : 'Unknown time';
  return when;
}

export default function AdminHomeScreen({
  staffName,
  overview,
  isLoading = false,
  refreshing = false,
  errorMessage,
  tabBarItems,
  onTabPress,
  onRefresh,
  onOpenUsers,
  onOpenUsersByCategory,
  onOpenPendingKyc,
  onOpenModeration,
  onOpenPreview,
  onOpenProfile,
  notificationCount = 0,
  onNotificationPress,
}: AdminHomeScreenProps) {
  const styles = useThemedStyles(createStyles);
  const firstName = staffName.trim().split(/\s+/)[0] || 'Staff';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Ops dashboard"
        subtitle={`Signed in as ${firstName}`}
        compact
        notificationCount={notificationCount}
        onNotificationPress={onNotificationPress}
      />
      <ScreenScroll
        keyboardAware={false}
        withTabBar
        refreshing={refreshing}
        onRefresh={onRefresh}
      >
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading && !overview && !refreshing ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.muted}>Loading platform overview…</Text>
          </View>
        ) : null}

        {!isLoading && !overview && !errorMessage ? (
          <EmptyState
            title="Overview unavailable"
            body="Pull to refresh or open Users to manage accounts directly."
            iconName="stats-chart-outline"
            primaryActionLabel="Retry"
            onPrimaryAction={onRefresh}
          />
        ) : null}

        {overview ? (
          <>
            <SectionHeader
              title="Platform pulse"
              subtitle="Teal tiles open a list — cream tiles are metrics only"
            />
            <View style={styles.statGrid}>
              <StatTile
                label="Users"
                value={overview.totalUsers}
                onPress={onOpenUsers}
              />
              <StatTile
                label="Staff"
                value={overview.staffCount}
                onPress={
                  onOpenUsersByCategory
                    ? () => onOpenUsersByCategory('STAFF')
                    : onOpenUsers
                }
              />
              <StatTile
                label="Suspended"
                value={overview.suspendedCount}
                tone={overview.suspendedCount > 0 ? 'danger' : 'default'}
              />
              <StatTile
                label="SOS (24h)"
                value={overview.sosLast24Hours}
                tone={overview.sosLast24Hours > 0 ? 'danger' : 'default'}
              />
            </View>

            <SectionHeader
              title="Users by role"
              subtitle="Teal tiles open that account list"
            />
            <View style={styles.statGrid}>
              <StatTile
                label="Students"
                value={overview.studentCount}
                onPress={
                  onOpenUsersByCategory
                    ? () => onOpenUsersByCategory('STUDENT')
                    : onOpenUsers
                }
              />
              <StatTile
                label="Tourists"
                value={overview.touristCount}
                onPress={
                  onOpenUsersByCategory
                    ? () => onOpenUsersByCategory('TOURIST')
                    : onOpenUsers
                }
              />
              <StatTile
                label="Hosts"
                value={overview.hostCount}
                onPress={
                  onOpenUsersByCategory
                    ? () => onOpenUsersByCategory('HOST')
                    : onOpenUsers
                }
              />
              <StatTile
                label="Guides"
                value={overview.guideCount}
                onPress={
                  onOpenUsersByCategory
                    ? () => onOpenUsersByCategory('GUIDE')
                    : onOpenUsers
                }
              />
            </View>

            <SectionHeader
              title="Marketplace & bookings"
              subtitle="Cream tiles are metrics only — teal tiles open a tool"
            />
            <View style={styles.statGrid}>
              <StatTile label="Live hosts" value={overview.activeHostListings} tone="success" />
              <StatTile label="Live guides" value={overview.activeGuideListings} tone="success" />
              <StatTile
                label="Hidden listings"
                value={overview.hiddenHostListings + overview.hiddenGuideListings}
                tone="warning"
                onPress={onOpenModeration}
              />
              <StatTile label="Pending bookings" value={overview.pendingBookings} tone="warning" />
              <StatTile label="Active bookings" value={overview.confirmedBookings} />
              <StatTile label="SOS (7d)" value={overview.sosLast7Days} />
              <StatTile
                label="Unverified ID"
                value={overview.unverifiedIdentityCount}
                onPress={onOpenPendingKyc}
              />
              <StatTile label="Unverified email" value={overview.unverifiedEmailCount} />
              <StatTile
                label="Pending KYC"
                value={overview.pendingKycCount ?? 0}
                tone={(overview.pendingKycCount ?? 0) > 0 ? 'warning' : 'default'}
                onPress={onOpenPendingKyc}
              />
            </View>

            <SectionHeader title="Ops tools" />
            <Card padding="none" style={styles.toolsCard}>
              <ToolRow
                title="Pending KYC"
                subtitle={
                  (overview.pendingKycCount ?? 0) > 0
                    ? `${overview.pendingKycCount} identity review${
                        overview.pendingKycCount === 1 ? '' : 's'
                      } waiting`
                    : 'No identity reviews waiting right now'
                }
                onPress={onOpenPendingKyc}
              />
              <ToolRow
                title="Listing moderation"
                subtitle="Hide or restore host and guide listings"
                onPress={onOpenModeration}
              />
              <ToolRow
                title="App preview"
                subtitle="Inspect what each role sees in the app"
                onPress={onOpenPreview}
                bordered={false}
              />
            </Card>

            <SectionHeader title="Recent bookings" />
            <Card style={styles.feedCard}>
              {(overview.recentBookings ?? []).length === 0 ? (
                <Text style={styles.muted}>No recent bookings.</Text>
              ) : (
                overview.recentBookings.slice(0, 6).map((item) => (
                  <View key={item.bookingId} style={styles.feedRow}>
                    <Text style={styles.feedTitle}>{formatBookingLine(item)}</Text>
                    <StatusBadge label={item.status} tone="info" />
                  </View>
                ))
              )}
            </Card>

            <SectionHeader title="Recent SOS" />
            <Card style={styles.feedCard}>
              {(overview.recentSosAlerts ?? []).length === 0 ? (
                <Text style={styles.muted}>No recent SOS alerts.</Text>
              ) : (
                overview.recentSosAlerts.slice(0, 6).map((item) => (
                  <View key={item.sosId} style={styles.feedRow}>
                    <Text style={styles.feedTitle}>{formatSosLine(item)}</Text>
                    <StatusBadge
                      label={item.contactedEmergency ? 'Emergency' : 'Logged'}
                      tone={item.contactedEmergency ? 'danger' : 'warning'}
                    />
                  </View>
                ))
              )}
            </Card>

            {onRefresh ? (
              <Pressable
                onPress={onRefresh}
                style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
                accessibilityRole="button"
              >
                <Text style={styles.refreshLabel}>Refresh overview</Text>
              </Pressable>
            ) : null}

            {onOpenProfile ? (
              <Pressable
                onPress={onOpenProfile}
                style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
                accessibilityRole="button"
              >
                <Text style={styles.refreshLabel}>Staff profile & sign out</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </ScreenScroll>
      <AppTabBar
        items={tabBarItems}
        activeTabId="home"
        onTabPress={onTabPress}
      />
    </View>
  );
}

function ToolRow({
  title,
  subtitle,
  onPress,
  bordered = true,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
  bordered?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.toolRow,
        bordered && styles.toolBorder,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingWrap: {
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.xl,
    },
    muted: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statTileInteractive: {
      width: '47%',
      flexGrow: 1,
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minHeight: touchTarget + spacing.md,
      borderWidth: borderWidths.strong,
      borderColor: colors.teal,
    },
    statTileReadOnly: {
      width: '47%',
      flexGrow: 1,
      backgroundColor: colors.warmCream,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minHeight: touchTarget + spacing.md,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
    },
    statDanger: {
      borderColor: colors.danger,
    },
    statWarning: {
      borderColor: colors.warning,
    },
    statSuccess: {
      borderColor: colors.success,
    },
    statTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.xs,
    },
    statValue: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.bold,
      color: colors.textPrimary,
      flexShrink: 1,
    },
    statValueReadOnly: {
      color: colors.textPrimary,
    },
    statLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    statLabelReadOnly: {
      color: colors.textTertiary,
    },
    statHint: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      marginTop: spacing.xs,
    },
    toolsCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    toolRow: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: touchTarget,
      justifyContent: 'center',
    },
    toolBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    toolTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    toolSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.caption,
    },
    feedCard: {
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    feedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    feedTitle: {
      flex: 1,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textPrimary,
    },
    refreshBtn: {
      minHeight: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    refreshLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}

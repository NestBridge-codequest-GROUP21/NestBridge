import { useThemedStyles, type AppTheme } from '../../theme';
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
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  borderRadius,
  touchTarget,
} from '../../constants/theme';

export interface AdminHomeScreenProps {
  staffName: string;
  overview: AdminOverview | null;
  isLoading?: boolean;
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
  onSosPress?: () => void;
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
  const content = (
    <>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </>
  );
  const tileStyle = [
    styles.statTile,
    tone === 'danger' && styles.statDanger,
    tone === 'warning' && styles.statWarning,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...tileStyle, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Browse ${label}`}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={tileStyle}>{content}</View>;
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
  onSosPress,
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
      <ScreenScroll>
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading && !overview ? (
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
            <SectionHeader title="Platform pulse" />
            <View style={styles.statGrid}>
              <StatTile label="Users" value={overview.totalUsers} />
              <StatTile label="Staff" value={overview.staffCount} />
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
              subtitle="Tap a role to browse every account in that category"
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

            <SectionHeader title="Marketplace & bookings" />
            <View style={styles.statGrid}>
              <StatTile label="Live hosts" value={overview.activeHostListings} tone="success" />
              <StatTile label="Live guides" value={overview.activeGuideListings} tone="success" />
              <StatTile
                label="Hidden listings"
                value={overview.hiddenHostListings + overview.hiddenGuideListings}
                tone="warning"
              />
              <StatTile label="Pending bookings" value={overview.pendingBookings} tone="warning" />
              <StatTile label="Active bookings" value={overview.confirmedBookings} />
              <StatTile label="SOS (7d)" value={overview.sosLast7Days} />
              <StatTile label="Unverified ID" value={overview.unverifiedIdentityCount} />
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
                    : 'Review identity submissions in the queue'
                }
                onPress={onOpenPendingKyc}
              />
              <ToolRow
                title="Manage users"
                subtitle="Browse by role, search, suspend, KYC, staff grant"
                onPress={onOpenUsers}
              />
              <ToolRow
                title="Content moderation"
                subtitle="Hide or restore host and guide listings"
                onPress={onOpenModeration}
              />
              <ToolRow
                title="App preview"
                subtitle="Inspect student, tourist, host, or guide experience"
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
        showSosDock
        onSosPress={onSosPress}
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
    statTile: {
      width: '47%',
      flexGrow: 1,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minHeight: touchTarget + spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    statDanger: {
      borderColor: colors.danger,
    },
    statWarning: {
      borderColor: colors.warning,
    },
    statValue: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.bold,
      color: colors.textPrimary,
    },
    statLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
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

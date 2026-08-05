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
import AppIcon, { type IoniconName } from '../../components/AppIcon';
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
  staffInitials?: string;
  staffPhotoUri?: string | null;
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

function formatBookingLine(item: AdminBookingActivity): string {
  return `${item.bookingType} · ${item.status}`;
}

function formatSosLine(item: AdminSosActivity): string {
  return item.triggeredAt
    ? new Date(item.triggeredAt).toLocaleString()
    : 'Unknown time';
}

function AttentionItem({
  label,
  value,
  tone = 'default',
  onPress,
}: {
  label: string;
  value: number;
  tone?: 'default' | 'warning' | 'danger';
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const interactive = Boolean(onPress);
  const valueColor =
    tone === 'danger'
      ? colors.danger
      : tone === 'warning'
        ? colors.warning
        : colors.textPrimary;

  const body = (
    <>
      <Text style={[styles.attentionValue, { color: valueColor }]}>{value}</Text>
      <Text style={styles.attentionLabel}>{label}</Text>
      {interactive ? (
        <View style={styles.attentionOpenRow}>
          <Text style={styles.attentionOpen}>Open</Text>
          <AppIcon name="chevron-forward" size={iconSizes.sm} color={colors.teal} />
        </View>
      ) : (
        <Text style={styles.attentionMetricHint}>Metric</Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.attentionCard,
          styles.attentionCardInteractive,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${label}`}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.attentionCard, styles.attentionCardMetric]}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      {body}
    </View>
  );
}

function MetricChip({ label, value }: { label: string; value: number }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={styles.metricChip}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={styles.metricChipValue}>{value}</Text>
      <Text style={styles.metricChipLabel}>{label}</Text>
    </View>
  );
}

function ToolRow({
  title,
  subtitle,
  iconName,
  onPress,
  bordered = true,
}: {
  title: string;
  subtitle: string;
  iconName: IoniconName;
  onPress?: () => void;
  bordered?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
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
      accessibilityLabel={title}
    >
      <View style={styles.toolIconWell}>
        <AppIcon name={iconName} size={iconSizes.md} color={colors.teal} />
      </View>
      <View style={styles.toolText}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolSubtitle}>{subtitle}</Text>
      </View>
      <AppIcon name="chevron-forward" size={iconSizes.md} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function AdminHomeScreen({
  staffName,
  staffInitials,
  staffPhotoUri,
  overview,
  isLoading = false,
  refreshing = false,
  errorMessage,
  tabBarItems,
  onTabPress,
  onRefresh,
  onOpenUsers,
  onOpenPendingKyc,
  onOpenModeration,
  onOpenPreview,
  onOpenProfile,
  notificationCount = 0,
  onNotificationPress,
}: AdminHomeScreenProps) {
  const styles = useThemedStyles(createStyles);
  const firstName = staffName.trim().split(/\s+/)[0] || 'Staff';
  const pendingKyc = overview?.pendingKycCount ?? 0;
  const hiddenListings =
    (overview?.hiddenHostListings ?? 0) + (overview?.hiddenGuideListings ?? 0);
  const initials =
    (staffInitials ?? '').trim() ||
    firstName.slice(0, 2).toUpperCase();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Ops"
        userName={firstName}
        userInitials={initials}
        userPhotoUri={staffPhotoUri}
        subtitle="Platform overview"
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
              title="Needs attention"
              subtitle="Items that usually need a staff action"
            />
            <View style={styles.attentionGrid}>
              <AttentionItem
                label="Pending KYC"
                value={pendingKyc}
                tone={pendingKyc > 0 ? 'warning' : 'default'}
                onPress={onOpenPendingKyc}
              />
              <AttentionItem
                label="Hidden listings"
                value={hiddenListings}
                tone={hiddenListings > 0 ? 'warning' : 'default'}
                onPress={onOpenModeration}
              />
              <AttentionItem
                label="SOS (24h)"
                value={overview.sosLast24Hours}
                tone={overview.sosLast24Hours > 0 ? 'danger' : 'default'}
              />
              <AttentionItem
                label="Suspended"
                value={overview.suspendedCount}
                tone={overview.suspendedCount > 0 ? 'danger' : 'default'}
              />
            </View>

            <SectionHeader title="Ops tools" subtitle="Open a workflow" />
            <Card padding="none" style={styles.toolsCard}>
              <ToolRow
                title="Browse users"
                subtitle="Search accounts by role or email"
                iconName="people-outline"
                onPress={onOpenUsers}
              />
              <ToolRow
                title="Pending KYC"
                subtitle={
                  pendingKyc > 0
                    ? `${pendingKyc} identity review${pendingKyc === 1 ? '' : 's'} waiting`
                    : 'No identity reviews waiting'
                }
                iconName="shield-checkmark-outline"
                onPress={onOpenPendingKyc}
              />
              <ToolRow
                title="Listing moderation"
                subtitle="Hide or restore host and guide listings"
                iconName="eye-off-outline"
                onPress={onOpenModeration}
              />
              <ToolRow
                title="App preview"
                subtitle="Inspect what each role sees"
                iconName="phone-portrait-outline"
                onPress={onOpenPreview}
                bordered={false}
              />
            </Card>

            <SectionHeader
              title="At a glance"
              subtitle="Read-only snapshot — not tappable"
            />
            <View style={styles.metricStrip}>
              <MetricChip label="Users" value={overview.totalUsers} />
              <MetricChip label="Students" value={overview.studentCount} />
              <MetricChip label="Tourists" value={overview.touristCount} />
              <MetricChip label="Hosts" value={overview.hostCount} />
              <MetricChip label="Guides" value={overview.guideCount} />
              <MetricChip label="Staff" value={overview.staffCount} />
              <MetricChip label="Live hosts" value={overview.activeHostListings} />
              <MetricChip label="Live guides" value={overview.activeGuideListings} />
              <MetricChip label="Pending bookings" value={overview.pendingBookings} />
              <MetricChip label="Active bookings" value={overview.confirmedBookings} />
              <MetricChip label="SOS (7d)" value={overview.sosLast7Days} />
              <MetricChip
                label="Unverified email"
                value={overview.unverifiedEmailCount}
              />
            </View>

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

function createStyles({ colors, tints }: AppTheme) {
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
    attentionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    attentionCard: {
      width: '47%',
      flexGrow: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minHeight: touchTarget + spacing.lg,
    },
    attentionCardInteractive: {
      backgroundColor: colors.white,
      borderWidth: borderWidths.strong,
      borderColor: colors.teal,
    },
    attentionCardMetric: {
      backgroundColor: colors.warmCream,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
    },
    attentionValue: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.bold,
    },
    attentionLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    attentionOpenRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    attentionOpen: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    attentionMetricHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textTertiary,
      marginTop: spacing.sm,
    },
    toolsCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    toolRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: touchTarget,
    },
    toolBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    toolIconWell: {
      width: touchTarget - spacing.sm,
      height: touchTarget - spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolText: {
      flex: 1,
      minWidth: 0,
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
    metricStrip: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      backgroundColor: colors.warmCream,
      borderRadius: borderRadius.md,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    metricChip: {
      minWidth: '30%',
      flexGrow: 1,
      paddingVertical: spacing.xs,
    },
    metricChipValue: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    metricChipLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textTertiary,
      marginTop: spacing.xs,
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

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
import SecondaryButton from '../../components/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import type { AdminListingModeration } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  touchTarget,
} from '../../constants/theme';

export type ModerationFilter = 'ALL' | 'HOST' | 'GUIDE' | 'HIDDEN';

export interface AdminModerationScreenProps {
  listings: AdminListingModeration[];
  filter: ModerationFilter;
  isLoading?: boolean;
  actionBusy?: boolean;
  errorMessage?: string | null;
  actionMessage?: string | null;
  tabBarItems: TabBarItem[];
  onTabPress?: (tabId: string) => void;
  onFilterChange?: (filter: ModerationFilter) => void;
  onToggleVisibility?: (listingId: string, hide: boolean) => void;
  onRefresh?: () => void;
  onBack?: () => void;
  onSosPress?: () => void;
}

const FILTERS: { id: ModerationFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'HOST', label: 'Hosts' },
  { id: 'GUIDE', label: 'Guides' },
  { id: 'HIDDEN', label: 'Hidden' },
];

export default function AdminModerationScreen({
  listings,
  filter,
  isLoading = false,
  actionBusy = false,
  errorMessage,
  actionMessage,
  tabBarItems,
  onTabPress,
  onFilterChange,
  onToggleVisibility,
  onRefresh,
  onBack,
  onSosPress,
}: AdminModerationScreenProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Moderation"
        subtitle="Hide or restore marketplace listings"
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        <View style={styles.filterRow}>
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => onFilterChange?.(item.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {actionMessage ? <InlineBanner tone="info" message={actionMessage} /> : null}

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.muted}>Loading listings…</Text>
          </View>
        ) : null}

        {!isLoading && listings.length === 0 ? (
          <EmptyState
            title="No listings"
            body="No host or guide listings match this filter."
            iconName="home-outline"
            primaryActionLabel="Refresh"
            onPrimaryAction={onRefresh}
          />
        ) : null}

        {listings.map((listing) => (
          <Card key={listing.listingId} style={styles.card}>
            <View style={styles.badgeRow}>
              <StatusBadge label={listing.type} tone="info" />
              <StatusBadge
                label={listing.hidden ? 'Hidden' : 'Live'}
                tone={listing.hidden ? 'warning' : 'success'}
              />
            </View>
            <Text style={styles.title}>{listing.ownerName}</Text>
            <Text style={styles.meta}>
              {[listing.ownerEmail, listing.city].filter(Boolean).join(' · ')}
            </Text>
            {listing.hidden ? (
              <PrimaryButton
                label={actionBusy ? 'Working…' : 'Restore listing'}
                onPress={() => onToggleVisibility?.(listing.listingId, false)}
                disabled={actionBusy}
              />
            ) : (
              <SecondaryButton
                label={actionBusy ? 'Working…' : 'Hide listing'}
                onPress={() => onToggleVisibility?.(listing.listingId, true)}
                disabled={actionBusy}
              />
            )}
          </Card>
        ))}

        {listings.length > 0 ? (
          <>
            <SectionHeader title="Tip" />
            <Text style={styles.muted}>
              Hiding a listing deactivates it in search and match results. Restore when the
              listing is ready to go live again.
            </Text>
          </>
        ) : null}
      </ScreenScroll>
      <AppTabBar
        items={tabBarItems}
        activeTabId="moderation"
        showSosDock
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
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    filterChip: {
      minHeight: touchTarget,
      paddingHorizontal: spacing.md,
      borderRadius: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterChipActive: {
      backgroundColor: colors.teal,
      borderColor: colors.teal,
    },
    filterLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    filterLabelActive: {
      color: colors.onPrimary,
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
      marginBottom: spacing.lg,
    },
    card: {
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}

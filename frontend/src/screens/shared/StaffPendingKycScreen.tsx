import { useThemedStyles, type AppTheme, useTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import StatusBadge from '../../components/StatusBadge';
import Avatar from '../../components/Avatar';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import type { AdminPendingKyc } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  touchTarget,
  borderWidths,
  lineHeights,
} from '../../constants/theme';

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export interface StaffPendingKycScreenProps {
  items: AdminPendingKyc[];
  isLoading?: boolean;
  errorMessage?: string | null;
  tabBarItems?: TabBarItem[];
  onSelectUser?: (userId: string) => void;
  onRefresh?: () => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
  onSosPress?: () => void;
}

export default function StaffPendingKycScreen({
  items,
  isLoading = false,
  errorMessage,
  tabBarItems,
  onSelectUser,
  onRefresh,
  onTabPress,
  onBack,
  onSosPress,
}: StaffPendingKycScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Pending KYC"
        subtitle="Identity reviews waiting on staff"
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading && items.length === 0 ? (
          <View
            style={styles.loadingWrap}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading pending KYC"
          >
            <ActivityIndicator color={colors.teal} />
            <Text style={styles.muted}>Loading queue…</Text>
          </View>
        ) : null}

        {!isLoading && items.length === 0 && !errorMessage ? (
          <EmptyState
            title="Queue clear"
            body="No pending identity verifications right now."
            iconName="checkmark-circle-outline"
            primaryActionLabel={onRefresh ? 'Refresh' : undefined}
            onPrimaryAction={onRefresh}
          />
        ) : null}

        {items.length > 0 ? (
          <Card padding="none" style={styles.listCard}>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <Pressable
                  key={item.jobId}
                  onPress={() => onSelectUser?.(item.userId)}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && styles.rowBorder,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Review KYC for ${item.fullName}`}
                >
                  <Avatar initials={initialsFromName(item.fullName)} size="md" />
                  <View style={styles.rowText}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.meta}>{item.email}</Text>
                    <Text style={styles.meta}>
                      {[item.primaryIntent, item.provider].filter(Boolean).join(' · ') ||
                        'Pending review'}
                    </Text>
                  </View>
                  <StatusBadge label="Pending" tone="warning" />
                </Pressable>
              );
            })}
          </Card>
        ) : null}

        {onRefresh ? (
          <Pressable
            onPress={onRefresh}
            style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Refresh pending KYC"
          >
            <Text style={styles.refreshLabel}>Refresh queue</Text>
          </Pressable>
        ) : null}
      </ScreenScroll>
      {tabBarItems?.length ? (
        <AppTabBar
          items={tabBarItems}
          activeTabId="home"
          showSosDock
          onSosPress={onSosPress}
          onTabPress={onTabPress}
        />
      ) : null}
    </View>
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
    listCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: touchTarget,
    },
    rowBorder: {
      borderBottomWidth: borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    rowText: {
      flex: 1,
      gap: spacing.xs,
    },
    name: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
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

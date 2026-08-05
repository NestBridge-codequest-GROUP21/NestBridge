import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import SearchField from '../../components/SearchField';
import SkeletonLoader from '../../components/SkeletonLoader';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import type { AdminUserSummary } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  touchTarget,
  borderRadius,
  borderWidths,
} from '../../constants/theme';

export type StaffUserCategory =
  | 'ALL'
  | 'STUDENT'
  | 'TOURIST'
  | 'HOST'
  | 'GUIDE'
  | 'STAFF';

export const STAFF_USER_CATEGORIES: {
  id: StaffUserCategory;
  label: string;
}[] = [
  { id: 'ALL', label: 'All' },
  { id: 'STUDENT', label: 'Students' },
  { id: 'TOURIST', label: 'Tourists' },
  { id: 'HOST', label: 'Hosts' },
  { id: 'GUIDE', label: 'Guides' },
  { id: 'STAFF', label: 'Staff' },
];

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

export interface StaffUserSearchScreenProps {
  query: string;
  category: StaffUserCategory;
  results: AdminUserSummary[];
  isLoading?: boolean;
  errorMessage?: string | null;
  hasLoaded?: boolean;
  tabBarItems?: TabBarItem[];
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: StaffUserCategory) => void;
  onSearch: () => void;
  onSelectUser: (userId: string) => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
}

export default function StaffUserSearchScreen({
  query,
  category,
  results,
  isLoading = false,
  errorMessage,
  hasLoaded = false,
  tabBarItems,
  onQueryChange,
  onCategoryChange,
  onSearch,
  onSelectUser,
  onTabPress,
  onBack,
}: StaffUserSearchScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Users"
        subtitle="Browse or search accounts by role"
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        <Card style={styles.searchCard} padding="lg">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {STAFF_USER_CATEGORIES.map((option) => {
              const active = category === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => onCategoryChange(option.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Filter ${option.label}`}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <SearchField
            value={query}
            placeholder="Name or email (optional)"
            onChangeText={onQueryChange}
            onClear={() => onQueryChange('')}
            onSubmitEditing={onSearch}
          />
          <PrimaryButton
            label={isLoading ? 'Loading…' : query.trim() ? 'Search' : 'Refresh list'}
            onPress={onSearch}
            disabled={isLoading}
            style={styles.searchButton}
          />
        </Card>

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading ? <SkeletonLoader style={styles.loader} /> : null}

        {!isLoading && hasLoaded && results.length === 0 && !errorMessage ? (
          <EmptyState
            title="No users in this category"
            body="Try another role chip, or search by name or email."
            tip="New accounts appear here after they finish Create account."
            iconName="people-outline"
          />
        ) : null}

        {!isLoading
          ? results.map((user) => (
              <Pressable
                key={user.userId}
                style={({ pressed }) => [styles.resultPress, pressed && styles.pressed]}
                onPress={() => onSelectUser(user.userId)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${user.fullName}`}
              >
                <Card style={styles.resultRow}>
                  <Avatar initials={initialsFromName(user.fullName)} size="md" />
                  <View style={styles.resultText}>
                    <Text style={styles.resultName}>{user.fullName}</Text>
                    <Text style={styles.resultMeta}>{user.email}</Text>
                    <View style={styles.badgeRow}>
                      <StatusBadge
                        label={user.primaryIntent ?? 'No intent'}
                        tone="neutral"
                      />
                      <StatusBadge
                        label={user.identityVerified ? 'Verified' : 'Unverified'}
                        tone={user.identityVerified ? 'success' : 'warning'}
                      />
                      {user.suspended ? (
                        <StatusBadge label="Suspended" tone="danger" />
                      ) : null}
                      {user.staff ? (
                        <StatusBadge label="Staff" tone="info" />
                      ) : null}
                    </View>
                  </View>
                  <Text style={[styles.resultAction, { color: colors.teal }]}>View</Text>
                </Card>
              </Pressable>
            ))
          : null}
      </ScreenScroll>
      {tabBarItems ? (
        <AppTabBar
          items={tabBarItems}
          activeTabId="users"
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
    searchCard: {
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    chipRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingBottom: spacing.xs,
    },
    chip: {
      minHeight: touchTarget,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.pill,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipActive: {
      backgroundColor: colors.teal,
      borderColor: colors.teal,
    },
    chipText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
    },
    chipTextActive: {
      color: colors.onAccent,
    },
    searchButton: {
      marginTop: spacing.xs,
    },
    loader: {
      marginVertical: spacing.lg,
    },
    resultPress: {
      marginBottom: spacing.sm,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget,
      gap: spacing.md,
    },
    pressed: {
      opacity: 0.92,
    },
    resultText: {
      flex: 1,
    },
    resultName: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    resultMeta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    resultAction: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      minWidth: touchTarget,
      textAlign: 'right',
    },
  });
}

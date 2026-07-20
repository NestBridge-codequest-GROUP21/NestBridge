import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
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
import type { AdminUserSummary } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  touchTarget,
} from '../../constants/theme';

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

export interface StaffUserSearchScreenProps {
  query: string;
  results: AdminUserSummary[];
  isLoading?: boolean;
  errorMessage?: string | null;
  hasSearched?: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onSelectUser: (userId: string) => void;
  onBack?: () => void;
}

export default function StaffUserSearchScreen({
  query,
  results,
  isLoading = false,
  errorMessage,
  hasSearched = false,
  onQueryChange,
  onSearch,
  onSelectUser,
  onBack,
}: StaffUserSearchScreenProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Staff tools"
        subtitle="Search users by name or email"
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        <Card style={styles.searchCard} padding="lg">
          <SearchField
            value={query}
            placeholder="Name or email"
            onChangeText={onQueryChange}
            onClear={() => onQueryChange('')}
            onSubmitEditing={onSearch}
          />
          <PrimaryButton
            label={isLoading ? 'Searching…' : 'Search'}
            onPress={onSearch}
            disabled={isLoading || query.trim().length === 0}
            style={styles.searchButton}
          />
        </Card>

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading ? <SkeletonLoader style={styles.loader} /> : null}

        {!isLoading && hasSearched && results.length === 0 && !errorMessage ? (
          <EmptyState
            title="No users matched"
            body="Try another name or email. Staff search looks across NestBridge accounts."
            iconName="search-outline"
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
                  <Text style={styles.resultAction}>View</Text>
                </Card>
              </Pressable>
            ))
          : null}
      </ScreenScroll>
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
    color: colors.teal,
    minWidth: touchTarget,
    textAlign: 'right',
  },
});
}


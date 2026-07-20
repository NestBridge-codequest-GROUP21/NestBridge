import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import type { AdminUserSummary } from '../../services/api';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

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
        <View style={styles.searchCard}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={onQueryChange}
            placeholder="Name or email"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={onSearch}
            accessibilityLabel="Search users"
          />
          <PrimaryButton
            label={isLoading ? 'Searching…' : 'Search'}
            onPress={onSearch}
            disabled={isLoading || query.trim().length === 0}
          />
        </View>

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}

        {!isLoading && hasSearched && results.length === 0 && !errorMessage ? (
          <EmptyState
            title="No users matched"
            body="Try another name or email. Staff search looks across NestBridge accounts."
            iconName="search-outline"
          />
        ) : null}

        {results.map((user) => (
          <Pressable
            key={user.userId}
            style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
            onPress={() => onSelectUser(user.userId)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${user.fullName}`}
          >
            <View style={styles.resultText}>
              <Text style={styles.resultName}>{user.fullName}</Text>
              <Text style={styles.resultMeta}>{user.email}</Text>
              <Text style={styles.resultMeta}>
                {[
                  user.primaryIntent ?? 'No intent',
                  user.identityVerified ? 'Verified' : 'Unverified',
                  user.suspended ? 'Suspended' : null,
                  user.staff ? 'Staff' : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
            <Text style={styles.resultAction}>View</Text>
          </Pressable>
        ))}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    minHeight: 44,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.92,
  },
  resultText: {
    flex: 1,
    paddingRight: spacing.sm,
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
    marginBottom: spacing.xs,
  },
  resultAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    minWidth: 44,
    textAlign: 'right',
  },
});

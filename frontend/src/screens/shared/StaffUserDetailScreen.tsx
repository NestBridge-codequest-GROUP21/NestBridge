import { useThemedStyles, type AppTheme, useTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import type { AdminUserDetail } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
} from '../../constants/theme';

export interface StaffUserDetailScreenProps {
  user: AdminUserDetail | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  actionBusy?: boolean;
  actionMessage?: string | null;
  onSuspend?: () => void;
  onUnsuspend?: () => void;
  onForceVerify?: () => void;
  onClearKyc?: () => void;
  onMarkEmailVerified?: () => void;
  onClearEmailVerified?: () => void;
  onGrantStaff?: () => void;
  onRevokeStaff?: () => void;
  onHideListing?: (listingId: string) => void;
  onRestoreListing?: (listingId: string) => void;
  onViewActivity?: () => void;
  onBack?: () => void;
}

function FactRow({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.factRow}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

export default function StaffUserDetailScreen({
  user,
  isLoading = false,
  errorMessage,
  actionBusy = false,
  actionMessage,
  onSuspend,
  onUnsuspend,
  onForceVerify,
  onClearKyc,
  onMarkEmailVerified,
  onClearEmailVerified,
  onGrantStaff,
  onRevokeStaff,
  onHideListing,
  onRestoreListing,
  onViewActivity,
  onBack,
}: StaffUserDetailScreenProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title={user?.fullName ?? 'User'}
        subtitle={user?.email ?? 'Account details'}
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        {isLoading ? <SkeletonLoader style={styles.loader} lines={4} /> : null}

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {actionMessage ? <InlineBanner tone="info" message={actionMessage} /> : null}

        {!user && !isLoading && !errorMessage ? (
          <EmptyState
            title="User not found"
            body="This account could not be loaded. Go back and search again."
            iconName="person-outline"
          />
        ) : null}

        {user && !isLoading ? (
          <>
            <View style={styles.badgeRow}>
              <StatusBadge
                label={user.suspended ? 'Suspended' : 'Active'}
                tone={user.suspended ? 'danger' : 'success'}
              />
              <StatusBadge
                label={user.identityVerified ? 'Verified' : 'Unverified'}
                tone={user.identityVerified ? 'success' : 'warning'}
              />
              {user.staff ? <StatusBadge label="Staff" tone="info" /> : null}
            </View>

            <SectionHeader title="Account basics" />
            <Card style={styles.card} padding="lg">
              <FactRow label="Intent" value={user.primaryIntent ?? 'None'} />
              <FactRow
                label="Identity"
                value={user.identityVerified ? 'Verified' : 'Not verified'}
              />
              <FactRow
                label="Email"
                value={user.emailVerified ? 'Verified' : 'Not verified'}
              />
              <FactRow label="Status" value={user.suspended ? 'Suspended' : 'Active'} />
              <FactRow label="Staff" value={user.staff ? 'Yes' : 'No'} />
              <FactRow label="Nationality" value={user.nationality ?? '—'} />
              <FactRow
                label="Seeker setup"
                value={user.seekerSetupStatus ?? 'NOT_STARTED'}
              />
            </Card>

            <SectionHeader title="Listings" />
            <Card style={styles.card} padding="lg">
              {user.listings.length === 0 ? (
                <Text style={styles.emptyText}>No host or guide listing.</Text>
              ) : (
                user.listings.map((listing, index) => (
                  <View
                    key={listing.listingId}
                    style={[
                      styles.listingRow,
                      index < user.listings.length - 1 && styles.listingBorder,
                    ]}
                  >
                    <Text style={styles.listingTitle}>
                      {listing.type}
                      {listing.city ? ` · ${listing.city}` : ''}
                    </Text>
                    <View style={styles.listingBadges}>
                      <StatusBadge
                        label={listing.active ? 'Active' : 'Hidden'}
                        tone={listing.active ? 'success' : 'neutral'}
                      />
                      <StatusBadge
                        label={listing.setupStatus ?? 'NOT_STARTED'}
                        tone="info"
                      />
                    </View>
                    <View style={styles.spacer} />
                    {listing.hidden ? (
                      <SecondaryButton
                        label={actionBusy ? 'Working…' : 'Restore listing'}
                        tone="success"
                        onPress={() => onRestoreListing?.(listing.listingId)}
                        disabled={actionBusy}
                      />
                    ) : (
                      <SecondaryButton
                        label={actionBusy ? 'Working…' : 'Hide listing'}
                        tone="danger"
                        onPress={() => onHideListing?.(listing.listingId)}
                        disabled={actionBusy}
                      />
                    )}
                  </View>
                ))
              )}
            </Card>

            <View style={styles.actions}>
              {user.suspended ? (
                <PrimaryButton
                  label={actionBusy ? 'Working…' : 'Unsuspend account'}
                  tone="success"
                  onPress={onUnsuspend}
                  disabled={actionBusy}
                />
              ) : (
                <PrimaryButton
                  label={actionBusy ? 'Working…' : 'Suspend account'}
                  tone="danger"
                  onPress={onSuspend}
                  disabled={actionBusy || user.staff}
                />
              )}
              <View style={styles.spacer} />
              {user.identityVerified ? (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Clear KYC flag'}
                  tone="danger"
                  onPress={onClearKyc}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Force-verify KYC'}
                  tone="success"
                  onPress={onForceVerify}
                  disabled={actionBusy}
                />
              )}
              <View style={styles.spacer} />
              {user.emailVerified ? (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Clear email verified'}
                  tone="danger"
                  onPress={onClearEmailVerified}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Mark email verified'}
                  tone="success"
                  onPress={onMarkEmailVerified}
                  disabled={actionBusy}
                />
              )}
              <View style={styles.spacer} />
              {user.staff ? (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Revoke staff access'}
                  tone="danger"
                  onPress={onRevokeStaff}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Grant staff access'}
                  tone="success"
                  onPress={onGrantStaff}
                  disabled={actionBusy}
                />
              )}
              <View style={styles.spacer} />
              <SecondaryButton label="View activity" onPress={onViewActivity} />
            </View>
          </>
        ) : null}
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
  loader: {
    marginVertical: spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  factLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    flexShrink: 0,
  },
  factValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
  },
  emptyText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  listingRow: {
    paddingVertical: spacing.sm,
  },
  listingBorder: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  listingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  listingBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  actions: {
    marginBottom: spacing.xl,
  },
  spacer: {
    height: spacing.sm,
  },
});
}


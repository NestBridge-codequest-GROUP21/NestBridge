import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import type { AdminUserDetail } from '../../services/api';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
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
  onGrantStaff?: () => void;
  onRevokeStaff?: () => void;
  onViewActivity?: () => void;
  onBack?: () => void;
}

function FactRow({ label, value }: { label: string; value: string }) {
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
  onGrantStaff,
  onRevokeStaff,
  onViewActivity,
  onBack,
}: StaffUserDetailScreenProps) {
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
        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {actionMessage ? <Text style={styles.infoText}>{actionMessage}</Text> : null}

        {user && !isLoading ? (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Account basics</Text>
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
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Listings</Text>
              {user.listings.length === 0 ? (
                <Text style={styles.emptyText}>No host or guide listing.</Text>
              ) : (
                user.listings.map((listing) => (
                  <View key={listing.listingId} style={styles.listingRow}>
                    <Text style={styles.listingTitle}>
                      {listing.type}
                      {listing.city ? ` · ${listing.city}` : ''}
                    </Text>
                    <Text style={styles.listingMeta}>
                      {[
                        listing.active ? 'Active' : 'Hidden',
                        listing.setupStatus ?? 'NOT_STARTED',
                      ].join(' · ')}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.actions}>
              {user.suspended ? (
                <PrimaryButton
                  label={actionBusy ? 'Working…' : 'Unsuspend account'}
                  onPress={onUnsuspend}
                  disabled={actionBusy}
                />
              ) : (
                <PrimaryButton
                  label={actionBusy ? 'Working…' : 'Suspend account'}
                  onPress={onSuspend}
                  disabled={actionBusy || user.staff}
                />
              )}
              <View style={styles.spacer} />
              {user.identityVerified ? (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Clear KYC flag'}
                  onPress={onClearKyc}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Force-verify KYC'}
                  onPress={onForceVerify}
                  disabled={actionBusy}
                />
              )}
              <View style={styles.spacer} />
              {user.staff ? (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Revoke staff access'}
                  onPress={onRevokeStaff}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Grant staff access'}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  infoText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.success,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
    marginBottom: spacing.sm,
  },
  listingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  listingMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  actions: {
    marginBottom: spacing.xl,
  },
  spacer: {
    height: spacing.sm,
  },
});

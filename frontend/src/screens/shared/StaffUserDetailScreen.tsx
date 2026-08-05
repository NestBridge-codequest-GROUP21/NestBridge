import { useThemedStyles, type AppTheme, useTheme } from '../../theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from 'react-native';
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
  borderRadius,
  touchTarget,
  controlHeights,
  lineHeights,
  avatarSizes,
} from '../../constants/theme';
import { appAlert } from '../../utils/appAlert';

export interface StaffUserDetailScreenProps {
  user: AdminUserDetail | null;
  isLoading?: boolean;
  refreshing?: boolean;
  errorMessage?: string | null;
  actionBusy?: boolean;
  actionMessage?: string | null;
  kycDocumentUri?: string | null;
  kycDocumentLoading?: boolean;
  kycDocumentError?: string | null;
  onSuspend?: () => void;
  onUnsuspend?: () => void;
  onForceVerify?: () => void;
  /** Reject KYC with a non-empty staff reason. */
  onRejectKyc?: (reason: string) => void;
  onUnlockIdentity?: () => void;
  onMarkEmailVerified?: () => void;
  onClearEmailVerified?: () => void;
  onGrantStaff?: () => void;
  onRevokeStaff?: () => void;
  onHideListing?: (listingId: string) => void;
  onRestoreListing?: (listingId: string) => void;
  onViewActivity?: () => void;
  onRefresh?: () => void;
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
  refreshing = false,
  errorMessage,
  actionBusy = false,
  actionMessage,
  kycDocumentUri,
  kycDocumentLoading = false,
  kycDocumentError,
  onSuspend,
  onUnsuspend,
  onForceVerify,
  onRejectKyc,
  onUnlockIdentity,
  onMarkEmailVerified,
  onClearEmailVerified,
  onGrantStaff,
  onRevokeStaff,
  onHideListing,
  onRestoreListing,
  onViewActivity,
  onRefresh,
  onBack,
}: StaffUserDetailScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const submitRejectReason = (raw: string) => {
    const reason = raw.trim();
    if (!reason) {
      appAlert('Reason required', 'Please provide a non-empty rejection reason.');
      return;
    }
    setRejectModalVisible(false);
    setRejectReason('');
    onRejectKyc?.(reason);
  };

  const handleRejectKycPress = () => {
    setRejectReason('');
    setRejectModalVisible(true);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title={user?.fullName ?? 'User'}
        subtitle={user?.email ?? 'Account details'}
        compact
        onBack={onBack}
      />
      <ScreenScroll
        keyboardAware={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      >
        {isLoading && !refreshing ? <SkeletonLoader style={styles.loader} lines={4} /> : null}

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {actionMessage ? <InlineBanner tone="info" message={actionMessage} /> : null}

        {!user && !isLoading && !errorMessage ? (
          <EmptyState
            title="User not found"
            body="This account could not be loaded. Go back and search again."
            iconName="person-outline"
          />
        ) : null}

        {user && !(isLoading && !refreshing) ? (
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
              {user.identityLocked ? (
                <StatusBadge label="Identity locked" tone="info" />
              ) : null}
              {user.staff ? <StatusBadge label="Staff" tone="info" /> : null}
              {user.hasKycDocument ? (
                <StatusBadge label="KYC photo" tone="info" />
              ) : null}
            </View>

            <SectionHeader title="KYC photo" />
            <Card style={styles.card} padding="lg">
              {kycDocumentLoading ? (
                <View style={styles.kycLoading}>
                  <ActivityIndicator color={colors.teal} />
                  <Text style={styles.emptyText}>Loading identity photo…</Text>
                </View>
              ) : null}
              {kycDocumentError ? (
                <InlineBanner tone="error" message={kycDocumentError} />
              ) : null}
              {!kycDocumentLoading && kycDocumentUri ? (
                <Image
                  source={{ uri: kycDocumentUri }}
                  style={styles.kycPhoto}
                  resizeMode="contain"
                  accessibilityLabel="Submitted KYC identity photo"
                />
              ) : null}
              {!kycDocumentLoading && !kycDocumentUri && !kycDocumentError ? (
                <Text style={styles.emptyText}>
                  {user.hasKycDocument
                    ? 'Photo flagged on file, but it could not be displayed.'
                    : 'No identity photo uploaded yet.'}
                </Text>
              ) : null}
            </Card>

            <SectionHeader title="Account basics" />
            <Card style={styles.card} padding="lg">
              <FactRow label="Intent" value={user.primaryIntent ?? 'None'} />
              <FactRow
                label="Identity"
                value={user.identityVerified ? 'Verified' : 'Not verified'}
              />
              <FactRow label="KYC status" value={user.kycStatus ?? 'none'} />
              <FactRow
                label="Identity lock"
                value={user.identityLocked ? 'Locked' : 'Unlocked'}
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
              {user.kycRejectionReason ? (
                <FactRow label="KYC reason" value={user.kycRejectionReason} />
              ) : null}
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
                  label={actionBusy ? 'Working…' : 'Reject KYC'}
                  accessibilityLabel="Reject KYC"
                  tone="danger"
                  onPress={handleRejectKycPress}
                  disabled={actionBusy}
                />
              ) : (
                <SecondaryButton
                  label={actionBusy ? 'Working…' : 'Force-verify KYC'}
                  accessibilityLabel="Force-verify KYC"
                  tone="success"
                  onPress={onForceVerify}
                  disabled={actionBusy}
                />
              )}
              {!user.identityVerified ? (
                <>
                  <View style={styles.spacer} />
                  <SecondaryButton
                    label={actionBusy ? 'Working…' : 'Reject KYC'}
                    accessibilityLabel="Reject KYC"
                    tone="danger"
                    onPress={handleRejectKycPress}
                    disabled={actionBusy}
                  />
                </>
              ) : null}
              {user.identityLocked ? (
                <>
                  <View style={styles.spacer} />
                  <SecondaryButton
                    label={actionBusy ? 'Working…' : 'Unlock identity'}
                    accessibilityLabel="Unlock identity"
                    onPress={onUnlockIdentity}
                    disabled={actionBusy}
                  />
                </>
              ) : null}
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

      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setRejectModalVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss reject KYC dialog"
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject KYC</Text>
            <Text style={styles.modalBody}>Enter a reason the user will see.</Text>
            <TextInput
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Rejection reason"
              placeholderTextColor={colors.textTertiary}
              style={styles.modalInput}
              multiline
              accessibilityLabel="KYC rejection reason"
              autoFocus
            />
            <View style={styles.modalActions}>
              <SecondaryButton
                label="Cancel"
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectReason('');
                }}
                style={styles.modalButton}
              />
              <PrimaryButton
                label="Reject KYC"
                accessibilityLabel="Reject KYC"
                tone="danger"
                onPress={() => submitRejectReason(rejectReason)}
                disabled={actionBusy}
                style={styles.modalButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function createStyles({ colors, overlays }: AppTheme) {
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
  kycLoading: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  kycPhoto: {
    width: '100%',
    height: avatarSizes.xl * 4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: overlays.scrim,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    zIndex: 1,
  },
  modalTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  modalBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  modalInput: {
    minHeight: controlHeights.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  modalActions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  modalButton: {
    minHeight: touchTarget,
  },
});
}

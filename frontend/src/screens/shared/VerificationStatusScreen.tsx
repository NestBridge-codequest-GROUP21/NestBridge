import { useThemedStyles, type AppTheme, useTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon, { type IoniconName } from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  iconSizes,
  avatarSizes,
} from '../../constants/theme';

export type VerificationUiStatus = 'pending' | 'approved' | 'rejected' | 'none';

export interface VerificationStatusScreenProps {
  status: VerificationUiStatus;
  rejectionReason?: string | null;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onBack?: () => void;
  onVerifyNow?: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
}

type StatusCopy = {
  title: string;
  body: string;
  iconName: IoniconName;
  tone: 'info' | 'success' | 'warning' | 'danger';
};

const STATUS_COPY: Record<VerificationUiStatus, StatusCopy> = {
  none: {
    title: 'Not started',
    body: 'Upload a face or ID photo for NestBridge staff to review. Verification unlocks booking, messaging, and hosting.',
    iconName: 'shield-outline',
    tone: 'info',
  },
  pending: {
    title: 'Under review',
    body: 'Your photo and profile are with NestBridge staff. Pull down to refresh after they approve you — booking and messaging unlock then.',
    iconName: 'time-outline',
    tone: 'warning',
  },
  approved: {
    title: "You're verified",
    body: 'Staff approved your identity. You can host, guide, book, and message on NestBridge.',
    iconName: 'checkmark-circle-outline',
    tone: 'success',
  },
  rejected: {
    title: 'Verification rejected',
    body: 'Your previous submission was not approved. Review the reason below, then try again.',
    iconName: 'close-circle-outline',
    tone: 'danger',
  },
};

export default function VerificationStatusScreen({
  status,
  rejectionReason,
  loading = false,
  refreshing = false,
  error,
  onBack,
  onVerifyNow,
  onRefresh,
  onRetry,
}: VerificationStatusScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, tints, scheme } = useTheme();
  const copy = STATUS_COPY[status];
  const showVerify =
    Boolean(onVerifyNow) && (status === 'none' || status === 'rejected');

  const iconTint =
    copy.tone === 'success'
      ? tints.teal
      : copy.tone === 'danger'
        ? tints.terracotta
        : copy.tone === 'warning'
          ? tints.gold
          : tints.teal;

  const iconColor =
    copy.tone === 'success'
      ? colors.success
      : copy.tone === 'danger'
        ? colors.danger
        : copy.tone === 'warning'
          ? colors.warning
          : colors.teal;

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader
        title="Verification status"
        subtitle="Identity review"
        compact
        onBack={onBack}
      />
      <ScreenScroll
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.teal}
              colors={[colors.teal]}
            />
          ) : undefined
        }
      >
        {error ? <InlineBanner tone="error" message={error} /> : null}

        {loading && !refreshing ? (
          <View style={styles.loadingWrap} accessibilityRole="progressbar" accessibilityLabel="Loading verification status">
            <ActivityIndicator color={colors.teal} />
            <Text style={styles.muted}>Checking your verification…</Text>
          </View>
        ) : (
          <Card style={styles.card} padding="lg">
            <View
              style={[styles.iconTile, { backgroundColor: iconTint }]}
              accessibilityLabel={copy.title}
            >
              <AppIcon name={copy.iconName} size={avatarSizes.md} color={iconColor} />
            </View>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.body}>{copy.body}</Text>
            {status === 'rejected' && rejectionReason ? (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>Reason from staff</Text>
                <Text style={styles.reasonText}>{rejectionReason}</Text>
              </View>
            ) : null}
            {onRefresh ? (
              <Text style={styles.hint}>Swipe down anytime to refresh status.</Text>
            ) : null}
          </Card>
        )}

        {!loading && showVerify ? (
          <PrimaryButton
            label="Verify now"
            accessibilityLabel="Verify now"
            onPress={onVerifyNow}
            style={styles.action}
          />
        ) : null}
        {!loading && error && onRetry ? (
          <SecondaryButton label="Try again" onPress={onRetry} style={styles.action} />
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
    card: {
      marginBottom: spacing.lg,
      alignItems: 'center',
    },
    iconTile: {
      width: avatarSizes.xl + iconSizes.lg,
      height: avatarSizes.xl + iconSizes.lg,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      lineHeight: lineHeights.heading,
    },
    body: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: lineHeights.body,
    },
    reasonBox: {
      alignSelf: 'stretch',
      marginTop: spacing.lg,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.warmCream,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    reasonLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    reasonText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textPrimary,
      lineHeight: lineHeights.body,
    },
    hint: {
      marginTop: spacing.md,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: lineHeights.caption,
    },
    action: {
      marginBottom: spacing.sm,
    },
  });
}

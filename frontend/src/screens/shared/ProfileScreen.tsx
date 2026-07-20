import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SecondaryButton from '../../components/SecondaryButton';
import AppIcon from '../../components/AppIcon';
import { profileCopy } from '../../data/appCopy';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  lineHeights,
} from '../../constants/theme';

export interface ProfileScreenProps {
  userName: string;
  userInitials: string;
  email: string;
  setupSummary: string;
  showTravelBooking?: boolean;
  onAccountSetupPress?: () => void;
  onTravelBookingPress?: () => void;
  onSignOut?: () => void;
  onResetDemo?: () => void;
  onDevTestingPress?: () => void;
  showStaffTools?: boolean;
  onStaffToolsPress?: () => void;
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function SettingsRow({
  title,
  subtitle,
  actionLabel,
  onPress,
  accessibilityLabel,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingsRow, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.settingsText}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      {actionLabel ? (
        <Text style={styles.settingsAction}>{actionLabel}</Text>
      ) : (
        <AppIcon
          name="chevron-forward"
          size={fontSizes.subheading}
          color={colors.textTertiary}
        />
      )}
    </Pressable>
  );
}

export default function ProfileScreen({
  userName,
  userInitials,
  email,
  setupSummary,
  showTravelBooking = false,
  onAccountSetupPress,
  onTravelBookingPress,
  onSignOut,
  onResetDemo,
  onDevTestingPress,
  showStaffTools = false,
  onStaffToolsPress,
}: ProfileScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Profile"
        userName={userName}
        userInitials={userInitials}
        subtitle={email}
      />

      <ScreenScroll>
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{userName}</Text>
            <Text style={styles.identityEmail}>{email}</Text>
            <Text style={styles.identitySummary}>{setupSummary}</Text>
          </View>
        </View>

        {showTravelBooking ? (
          <>
            <SectionLabel>Travel</SectionLabel>
            <Pressable
              style={({ pressed }) => [styles.travelCard, pressed && styles.pressed]}
              onPress={onTravelBookingPress}
              accessibilityRole="button"
              accessibilityLabel="Book as a traveller"
            >
              <View style={styles.travelIcon}>
                <AppIcon name="airplane-outline" size={22} color={colors.tealDeep} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Book as a traveller</Text>
                <Text style={styles.settingsSubtitle}>
                  Find a homestay or local guide for your own trip in Ghana
                </Text>
              </View>
              <AppIcon name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </>
        ) : null}

        <SectionLabel>Account</SectionLabel>
        <View style={styles.groupCard}>
          <SettingsRow
            title="Account setup"
            subtitle={setupSummary}
            actionLabel="Manage"
            onPress={onAccountSetupPress}
            accessibilityLabel="Account setup"
          />
        </View>

        {showStaffTools ? (
          <>
            <SectionLabel>Staff</SectionLabel>
            <View style={styles.groupCard}>
              <SettingsRow
                title="Staff tools"
                subtitle="Search users, suspend accounts, and review activity"
                actionLabel="Open"
                onPress={onStaffToolsPress}
                accessibilityLabel="Staff tools"
              />
            </View>
          </>
        ) : null}

        <SectionLabel>About</SectionLabel>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutBody}>{profileCopy.aboutAccount}</Text>
        </View>

        {__DEV__ ? (
          <>
            <SectionLabel>Developer</SectionLabel>
            <View style={styles.groupCard}>
              <SettingsRow
                title="Developer testing"
                subtitle="Open app flows without finishing onboarding"
                actionLabel="Open"
                onPress={onDevTestingPress}
                accessibilityLabel="Developer testing"
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                title="Reset demo profile"
                subtitle="Clear onboarding progress on this device"
                actionLabel="Reset"
                onPress={onResetDemo}
                accessibilityLabel="Reset demo profile"
              />
            </View>
          </>
        ) : null}

        <View style={styles.signOutWrap}>
          <SecondaryButton label="Sign out" onPress={onSignOut} />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  identityText: {
    flex: 1,
  },
  identityName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  identityEmail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  identitySummary: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    lineHeight: lineHeights.caption,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  travelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tints.gold,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 72,
    ...shadows.card,
  },
  travelIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
    gap: spacing.sm,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingsSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  settingsAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  aboutBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  signOutWrap: {
    marginBottom: spacing.xl,
  },
  pressed: {
    opacity: 0.92,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SecondaryButton from '../../components/SecondaryButton';
import AppIcon from '../../components/AppIcon';
import { profileCopy } from '../../data/appCopy';
import type { ProfileHubItem } from '../../data/profileHub';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

export interface ProfileScreenProps {
  userName: string;
  userInitials: string;
  email: string;
  setupSummary: string;
  culturalGuidanceItems?: ProfileHubItem[];
  showTravelBooking?: boolean;
  onAccountSetupPress?: () => void;
  onCulturalGuidanceItemPress?: (itemId: string) => void;
  onCoreServicesPress?: () => void;
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
  culturalGuidanceItems = [],
  showTravelBooking = false,
  onAccountSetupPress,
  onCulturalGuidanceItemPress,
  onCoreServicesPress,
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

        <SectionLabel>Account</SectionLabel>
        <View style={styles.groupCard}>
          <SettingsRow
            title="Account setup"
            subtitle={setupSummary}
            actionLabel="Manage"
            onPress={onAccountSetupPress}
            accessibilityLabel="Account setup"
          />
          {showTravelBooking ? (
            <>
              <View style={styles.rowDivider} />
              <SettingsRow
                title="Book as a traveller"
                subtitle="Find homestays or guides for your own trips"
                actionLabel="Browse"
                onPress={onTravelBookingPress}
                accessibilityLabel="Book travel"
              />
            </>
          ) : null}
        </View>

        <SectionLabel>Explore</SectionLabel>
        <View style={styles.groupCard}>
          <SettingsRow
            title="Core services"
            subtitle="Homestays, guides, hotels, and lodging"
            actionLabel="Search"
            onPress={onCoreServicesPress}
            accessibilityLabel="Core services"
          />
          {culturalGuidanceItems.map((item) => (
            <React.Fragment key={item.id}>
              <View style={styles.rowDivider} />
              <Pressable
                style={({ pressed }) => [styles.hubRow, pressed && styles.pressed]}
                onPress={() => onCulturalGuidanceItemPress?.(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.hubIconTile}>
                  <AppIcon glyph={item.icon} size={20} color={colors.tealDeep} />
                </View>
                <View style={styles.hubText}>
                  <Text style={styles.settingsTitle}>{item.label}</Text>
                  <Text style={styles.settingsSubtitle}>{item.description}</Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={fontSizes.subheading}
                  color={colors.textTertiary}
                />
              </Pressable>
            </React.Fragment>
          ))}
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
            <SectionLabel>Testing</SectionLabel>
            <View style={styles.groupCard}>
              <Text style={styles.devHint}>
                Sign out to return to Welcome. Reset demo clears profile progress
                on this device.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.devMenuButton, pressed && styles.pressed]}
                onPress={onDevTestingPress}
                accessibilityRole="button"
                accessibilityLabel="Developer testing menu"
              >
                <Text style={styles.devMenuButtonText}>Developer testing menu</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        <View style={styles.signOutWrap}>
          <SecondaryButton label="Sign out" onPress={onSignOut} />
          {__DEV__ ? (
            <>
              <View style={styles.buttonSpacer} />
              <SecondaryButton label="Reset demo" onPress={onResetDemo} />
            </>
          ) : null}
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
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
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
    marginBottom: spacing.xs / 2,
  },
  identityEmail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  identitySummary: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.teal,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  settingsText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  settingsTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  settingsSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  settingsAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    minWidth: 44,
    textAlign: 'right',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  hubIconTile: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hubText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  aboutBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  devHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  devMenuButton: {
    minHeight: 44,
    justifyContent: 'center',
    margin: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devMenuButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textAlign: 'center',
  },
  signOutWrap: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  buttonSpacer: {
    height: spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
});

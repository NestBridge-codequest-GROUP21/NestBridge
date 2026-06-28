import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import SecondaryButton from '../../components/SecondaryButton';
import { profileCopy } from '../../data/appCopy';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../../constants/theme';

export interface ProfileScreenProps {
  userName: string;
  userInitials: string;
  email: string;
  setupSummary: string;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  onAccountSetupPress?: () => void;
  onSignOut?: () => void;
  onResetDemo?: () => void;
  onDevTestingPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function ProfileScreen({
  userName,
  userInitials,
  email,
  setupSummary,
  tabBarItems,
  activeTabId,
  onAccountSetupPress,
  onSignOut,
  onResetDemo,
  onDevTestingPress,
  onTabPress,
}: ProfileScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Account"
        userName={userName}
        userInitials={userInitials}
        subtitle={email}
      />

      <ScreenScroll withTabBar>
        <Pressable
          style={({ pressed }) => [styles.servicesCard, pressed && styles.pressed]}
          onPress={onAccountSetupPress}
          accessibilityRole="button"
          accessibilityLabel="Account setup"
        >
          <View style={styles.servicesText}>
            <Text style={styles.servicesTitle}>Account setup</Text>
            <Text style={styles.servicesSubtitle}>{setupSummary}</Text>
          </View>
          <Text style={styles.servicesAction}>Manage</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About your account</Text>
          <Text style={styles.sectionBody}>{profileCopy.aboutAccount}</Text>
        </View>

        {__DEV__ ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testing flows</Text>
          <Text style={styles.sectionBody}>
            Sign out to return to Welcome and sign in again as a returning user.
            Reset demo to clear profile progress and test as a new user on this
            device.
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
        ) : null}

        <SecondaryButton label="Sign out" onPress={onSignOut} />
        {__DEV__ ? (
          <>
            <View style={styles.buttonSpacer} />
            <SecondaryButton label="Reset demo" onPress={onResetDemo} />
          </>
        ) : null}
      </ScreenScroll>

      <AppTabBar items={tabBarItems} activeTabId={activeTabId} onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  servicesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  pressed: {
    opacity: 0.95,
  },
  servicesText: {
    flex: 1,
  },
  servicesTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  servicesSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  servicesAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    minWidth: 44,
    textAlign: 'right',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  devMenuButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: spacing.md,
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
  buttonSpacer: {
    height: spacing.sm,
  },
});

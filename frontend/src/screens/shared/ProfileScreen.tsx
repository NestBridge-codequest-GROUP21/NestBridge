import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SecondaryButton from '../../components/SecondaryButton';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import ListRow from '../../components/ListRow';
import SectionHeader from '../../components/SectionHeader';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import Constants from 'expo-constants';
import { profileCopy, splashCopy } from '../../data/appCopy';
import BrandLogo from '../../components/BrandLogo';
import {
  useThemedStyles,
  type AppTheme,
} from '../../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
} from '../../constants/theme';

export interface ProfileScreenProps {
  userName: string;
  userInitials: string;
  /** Bio/profile photo — initials only when absent. */
  userPhotoUri?: string | null;
  email: string;
  setupSummary: string;
  showTravelBooking?: boolean;
  /** When false, hide consumer account-setup entry (staff shell). */
  showAccountSetup?: boolean;
  showEditTravelPreferences?: boolean;
  tabBarItems?: TabBarItem[];
  activeTabId?: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
  onAccountSetupPress?: () => void;
  onEditTravelPreferencesPress?: () => void;
  onTravelBookingPress?: () => void;
  onSettingsPress?: () => void;
  onHelpPress?: () => void;
  onRatingsPress?: () => void;
  onVerificationStatusPress?: () => void;
  onSignOut?: () => void;
  showStaffTools?: boolean;
  onStaffToolsPress?: () => void;
  showReturnToOps?: boolean;
  onReturnToOpsPress?: () => void;
  showAppPreview?: boolean;
  onAppPreviewPress?: () => void;
  showExitPreview?: boolean;
  onExitPreviewPress?: () => void;
}

export default function ProfileScreen({
  userName,
  userInitials,
  userPhotoUri,
  email,
  setupSummary,
  showTravelBooking = false,
  showAccountSetup = true,
  showEditTravelPreferences = false,
  tabBarItems,
  activeTabId = '',
  showSosDock = false,
  onSosPress,
  onTabPress,
  onBack,
  onAccountSetupPress,
  onEditTravelPreferencesPress,
  onTravelBookingPress,
  onSettingsPress,
  onHelpPress,
  onRatingsPress,
  onVerificationStatusPress,
  onSignOut,
  showStaffTools = false,
  onStaffToolsPress,
  showReturnToOps = false,
  onReturnToOpsPress,
  showAppPreview = false,
  onAppPreviewPress,
  showExitPreview = false,
  onExitPreviewPress,
}: ProfileScreenProps) {
  const styles = useThemedStyles(createStyles);
  const showTabBar = Boolean(tabBarItems?.length);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Profile"
        userName={userName}
        userInitials={userInitials}
        userPhotoUri={userPhotoUri}
        subtitle={
          showAccountSetup === false
            ? 'Staff account — settings and sign out'
            : 'Account setup and settings'
        }
        onBack={onBack}
      />

      <ScreenScroll>
        <Card style={styles.identityCard} padding="lg">
          <Avatar
            initials={userInitials}
            photoUri={userPhotoUri}
            size="lg"
            highlighted
          />
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{userName}</Text>
            <Text style={styles.identityEmail}>{email}</Text>
            <Text style={styles.identitySummary}>{setupSummary}</Text>
          </View>
        </Card>

        <SectionHeader title="Settings" />
        <Card padding="none" style={styles.groupCard}>
          {showAccountSetup ? (
            <ListRow
              title="Account setup"
              subtitle="View progress and finish remaining steps"
              iconName="person-circle-outline"
              onPress={onAccountSetupPress}
              style={styles.listRowPad}
              bordered={
                showEditTravelPreferences ||
                showTravelBooking ||
                Boolean(onVerificationStatusPress) ||
                Boolean(onRatingsPress) ||
                Boolean(onSettingsPress) ||
                Boolean(onHelpPress)
              }
            />
          ) : null}
          {!showAccountSetup ? (
            <ListRow
              title="NestBridge staff"
              subtitle="You manage users, KYC, and marketplace listings"
              iconName="shield-checkmark-outline"
              showChevron={false}
              style={styles.listRowPad}
              bordered={
                Boolean(onSettingsPress) || Boolean(onHelpPress)
              }
            />
          ) : null}
          {showEditTravelPreferences ? (
            <ListRow
              title="Travel & match preferences"
              subtitle="Change destination, dates, budget, diet, and lifestyle"
              iconName="map-outline"
              onPress={onEditTravelPreferencesPress}
              style={styles.listRowPad}
              bordered={
                showTravelBooking ||
                Boolean(onVerificationStatusPress) ||
                Boolean(onSettingsPress) ||
                Boolean(onRatingsPress) ||
                Boolean(onHelpPress)
              }
            />
          ) : null}
          {showTravelBooking ? (
            <ListRow
              title="Book as a traveller"
              subtitle="Find a homestay or local guide for your own trip in Ghana"
              iconName="airplane-outline"
              onPress={onTravelBookingPress}
              style={styles.listRowPad}
              bordered={
                Boolean(onVerificationStatusPress) ||
                Boolean(onSettingsPress) ||
                Boolean(onRatingsPress) ||
                Boolean(onHelpPress)
              }
            />
          ) : null}
          {onVerificationStatusPress ? (
            <ListRow
              title="Verification status"
              subtitle="Check identity review, rejection reasons, or verify again"
              iconName="shield-checkmark-outline"
              onPress={onVerificationStatusPress}
              style={styles.listRowPad}
              bordered={
                Boolean(onRatingsPress) ||
                Boolean(onSettingsPress) ||
                Boolean(onHelpPress)
              }
            />
          ) : null}
          {onRatingsPress ? (
            <ListRow
              title="Ratings & reviews"
              subtitle="Rate completed stays and guide sessions"
              iconName="star-outline"
              onPress={onRatingsPress}
              style={styles.listRowPad}
              bordered={Boolean(onSettingsPress) || Boolean(onHelpPress)}
            />
          ) : null}
          {onSettingsPress ? (
            <ListRow
              title="Settings"
              subtitle="Appearance themes and notifications"
              iconName="settings-outline"
              onPress={onSettingsPress}
              style={styles.listRowPad}
              bordered={Boolean(onHelpPress)}
            />
          ) : null}
          {onHelpPress ? (
            <ListRow
              title="Help desk"
              subtitle="Stuck on booking, payment, KYC, or sign-in"
              iconName="help-circle-outline"
              onPress={onHelpPress}
              style={styles.listRowPad}
              bordered={false}
            />
          ) : null}
        </Card>

        {showExitPreview || showReturnToOps || showAppPreview || showStaffTools ? (
          <>
            <SectionHeader title="Staff" />
            <Card padding="none" style={styles.groupCard}>
              {showExitPreview ? (
                <ListRow
                  title="Exit app preview"
                  subtitle="Return to the ops dashboard"
                  iconName="exit-outline"
                  onPress={onExitPreviewPress}
                  style={styles.listRowPad}
                  bordered={showReturnToOps || showAppPreview || showStaffTools}
                />
              ) : null}
              {showReturnToOps ? (
                <ListRow
                  title="Ops dashboard"
                  subtitle="Platform overview, users, and moderation"
                  iconName="grid-outline"
                  onPress={onReturnToOpsPress}
                  style={styles.listRowPad}
                  bordered={showAppPreview || showStaffTools}
                />
              ) : null}
              {showAppPreview ? (
                <ListRow
                  title="Switch to app preview"
                  subtitle="Inspect what each role sees (logged)"
                  iconName="eye-outline"
                  onPress={onAppPreviewPress}
                  style={styles.listRowPad}
                  bordered={showStaffTools}
                />
              ) : null}
              {showStaffTools ? (
                <ListRow
                  title="Manage users"
                  subtitle="Search, suspend, KYC, and activity"
                  iconName="people-outline"
                  onPress={onStaffToolsPress}
                  style={styles.listRowPad}
                  bordered={false}
                />
              ) : null}
            </Card>
          </>
        ) : null}

        <SectionHeader title="About NestBridge" />
        <Card style={styles.aboutCard}>
          <BrandLogo size="sm" style={styles.aboutLogo} />
          <Text style={styles.aboutBrand}>{profileCopy.brandName}</Text>
          <Text style={styles.aboutTagline}>{profileCopy.tagline}</Text>
          <Text style={styles.aboutVersion}>
            Version{' '}
            {Constants.expoConfig?.version ??
              Constants.nativeAppVersion ??
              '1.0.1'}
          </Text>
          <Text style={styles.aboutMission}>{splashCopy.description}</Text>
          <Text style={styles.aboutBody}>{profileCopy.aboutAccount}</Text>
          <Text style={styles.aboutCopyright}>{profileCopy.copyright}</Text>
        </Card>

        <View style={styles.signOutWrap}>
          <SecondaryButton label="Sign out" tone="danger" onPress={onSignOut} />
        </View>
      </ScreenScroll>

      {showTabBar && tabBarItems ? (
        <AppTabBar
          items={tabBarItems}
          activeTabId={activeTabId}
          showSosDock={showSosDock}
          onSosPress={onSosPress}
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
    identityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.md,
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
    groupCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    listRowPad: {
      paddingHorizontal: spacing.md,
    },
    aboutCard: {
      marginBottom: spacing.lg,
      alignItems: 'center',
    },
    aboutLogo: {
      marginBottom: spacing.md,
    },
    aboutBrand: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    aboutTagline: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    aboutVersion: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    aboutMission: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    aboutBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    aboutCopyright: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      textAlign: 'center',
    },
    signOutWrap: {
      marginBottom: spacing.xl,
    },
  });
}

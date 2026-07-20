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
import { profileCopy } from '../../data/appCopy';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
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
        <Card style={styles.identityCard} padding="lg">
          <Avatar initials={userInitials} size="lg" highlighted />
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{userName}</Text>
            <Text style={styles.identityEmail}>{email}</Text>
            <Text style={styles.identitySummary}>{setupSummary}</Text>
          </View>
        </Card>

        {showTravelBooking ? (
          <>
            <SectionHeader title="Travel" />
            <Card padding="none" style={styles.groupCard}>
              <ListRow
                title="Book as a traveller"
                subtitle="Find a homestay or local guide for your own trip in Ghana"
                iconName="airplane-outline"
                onPress={onTravelBookingPress}
                style={styles.listRowPad}
                bordered={false}
              />
            </Card>
          </>
        ) : null}

        <SectionHeader title="Account" />
        <Card padding="none" style={styles.groupCard}>
          <ListRow
            title="Account setup"
            subtitle={setupSummary}
            iconName="person-circle-outline"
            onPress={onAccountSetupPress}
            style={styles.listRowPad}
            bordered={false}
          />
        </Card>

        {showStaffTools ? (
          <>
            <SectionHeader title="Staff" />
            <Card padding="none" style={styles.groupCard}>
              <ListRow
                title="Staff tools"
                subtitle="Search users, suspend accounts, and review activity"
                iconName="shield-checkmark-outline"
                onPress={onStaffToolsPress}
                style={styles.listRowPad}
                bordered={false}
              />
            </Card>
          </>
        ) : null}

        <SectionHeader title="About" />
        <Card style={styles.aboutCard}>
          <Text style={styles.aboutBody}>{profileCopy.aboutAccount}</Text>
        </Card>

        {__DEV__ ? (
          <>
            <SectionHeader title="Developer" />
            <Card padding="none" style={styles.groupCard}>
              <ListRow
                title="Developer testing"
                subtitle="Open app flows without finishing onboarding"
                iconName="construct-outline"
                onPress={onDevTestingPress}
                style={styles.listRowPad}
              />
              <ListRow
                title="Reset demo profile"
                subtitle="Clear onboarding progress on this device"
                iconName="refresh-outline"
                onPress={onResetDemo}
                style={styles.listRowPad}
                bordered={false}
              />
            </Card>
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
});

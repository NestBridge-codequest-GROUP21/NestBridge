import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import SecondaryButton from '../../components/SecondaryButton';
import { profileCopy } from '../../data/appCopy';
import type { ProfileHubItem } from '../../data/profileHub';
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
  culturalGuidanceItems?: ProfileHubItem[];
  showTravelBooking?: boolean;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onAccountSetupPress?: () => void;
  onCulturalGuidanceItemPress?: (itemId: string) => void;
  onCoreServicesPress?: () => void;
  onTravelBookingPress?: () => void;
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
  culturalGuidanceItems = [],
  showTravelBooking = false,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  onAccountSetupPress,
  onCulturalGuidanceItemPress,
  onCoreServicesPress,
  onTravelBookingPress,
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

      <ScreenScroll withTabBar withSosDock={showSosDock}>
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

        {culturalGuidanceItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural guidance</Text>
            {culturalGuidanceItems.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.hubRow, pressed && styles.pressed]}
                onPress={() => onCulturalGuidanceItemPress?.(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <Text style={styles.hubIcon}>{item.icon}</Text>
                <View style={styles.hubText}>
                  <Text style={styles.hubLabel}>{item.label}</Text>
                  <Text style={styles.hubDescription}>{item.description}</Text>
                </View>
                <Text style={styles.hubChevron}>›</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.servicesCard, pressed && styles.pressed]}
          onPress={onCoreServicesPress}
          accessibilityRole="button"
          accessibilityLabel="Core services"
        >
          <View style={styles.servicesText}>
            <Text style={styles.servicesTitle}>Core services</Text>
            <Text style={styles.servicesSubtitle}>
              Homestays, guides, hotels, and lodging in one search hub
            </Text>
          </View>
          <Text style={styles.servicesAction}>Search</Text>
        </Pressable>

        {showTravelBooking ? (
          <Pressable
            style={({ pressed }) => [styles.servicesCard, pressed && styles.pressed]}
            onPress={onTravelBookingPress}
            accessibilityRole="button"
            accessibilityLabel="Book travel"
          >
            <View style={styles.servicesText}>
              <Text style={styles.servicesTitle}>Book as a traveller</Text>
              <Text style={styles.servicesSubtitle}>
                Find homestays or guides for your own trips while you host or guide
              </Text>
            </View>
            <Text style={styles.servicesAction}>Browse</Text>
          </Pressable>
        ) : null}

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

      <AppTabBar
        items={tabBarItems}
        activeTabId={activeTabId}
        showSosDock={showSosDock}
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
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
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  hubIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  hubText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  hubLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hubDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  hubChevron: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.heading,
    color: colors.textTertiary,
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

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import SecondaryButton from '../../components/SecondaryButton';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import ListRow from '../../components/ListRow';
import SectionHeader from '../../components/SectionHeader';
import AppIcon from '../../components/AppIcon';
import Constants from 'expo-constants';
import { profileCopy, splashCopy } from '../../data/appCopy';
import BrandLogo from '../../components/BrandLogo';
import {
  useTheme,
  useThemedStyles,
  themeTokensForPreference,
  type AppTheme,
  type ThemePreference,
} from '../../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  borderRadius,
  borderWidths,
  iconSizes,
  touchTarget,
} from '../../constants/theme';

export interface ProfileScreenProps {
  userName: string;
  userInitials: string;
  email: string;
  setupSummary: string;
  showTravelBooking?: boolean;
  onBack?: () => void;
  onAccountSetupPress?: () => void;
  onTravelBookingPress?: () => void;
  onSignOut?: () => void;
  onResetDemo?: () => void;
  onDevTestingPress?: () => void;
  showStaffTools?: boolean;
  onStaffToolsPress?: () => void;
}

const APPEARANCE_OPTIONS: {
  id: ThemePreference;
  label: string;
  subtitle: string;
}[] = [
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Default NestBridge look',
  },
  {
    id: 'dark-teal',
    label: 'Dark Teal',
    subtitle: 'Cool navy night with teal accents',
  },
  {
    id: 'dark-warm',
    label: 'Dark Warm',
    subtitle: 'Charcoal surfaces with gold warmth',
  },
  {
    id: 'dark-bold',
    label: 'Dark Bold',
    subtitle: 'True black with solid accent blocks',
  },
];

export default function ProfileScreen({
  userName,
  userInitials,
  email,
  setupSummary,
  showTravelBooking = false,
  onBack,
  onAccountSetupPress,
  onTravelBookingPress,
  onSignOut,
  onResetDemo,
  onDevTestingPress,
  showStaffTools = false,
  onStaffToolsPress,
}: ProfileScreenProps) {
  const { preference, setPreference, colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Profile"
        userName={userName}
        userInitials={userInitials}
        subtitle="Account and setup"
        onBack={onBack}
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

        <SectionHeader title="Appearance" />
        <Card padding="none" style={styles.groupCard}>
          {APPEARANCE_OPTIONS.map((option, index) => {
            const selected = preference === option.id;
            const isLast = index === APPEARANCE_OPTIONS.length - 1;
            const preview = themeTokensForPreference(option.id).colors;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPreference(option.id)}
                style={({ pressed }) => [
                  styles.appearanceRow,
                  !isLast && styles.appearanceRowBorder,
                  pressed && styles.appearancePressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${option.label} theme`}
              >
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: preview.background },
                  ]}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <View
                    style={[
                      styles.swatchSurface,
                      { backgroundColor: preview.surface },
                    ]}
                  />
                  <View
                    style={[
                      styles.swatchAccent,
                      { backgroundColor: preview.tabActive },
                    ]}
                  />
                  <View
                    style={[
                      styles.swatchAccentSecondary,
                      { backgroundColor: preview.terracotta },
                    ]}
                  />
                </View>
                <View style={styles.appearanceText}>
                  <Text style={styles.appearanceLabel}>{option.label}</Text>
                  <Text style={styles.appearanceSubtitle}>{option.subtitle}</Text>
                </View>
                {selected ? (
                  <AppIcon
                    name="checkmark-circle"
                    size={iconSizes.lg}
                    color={colors.success}
                  />
                ) : (
                  <View style={styles.radioIdle} />
                )}
              </Pressable>
            );
          })}
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
            subtitle="View progress and finish remaining steps"
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
    appearanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget + spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    appearanceRowBorder: {
      borderBottomWidth: borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    appearancePressed: {
      opacity: 0.92,
    },
    swatch: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      overflow: 'hidden',
      padding: spacing.xs,
      justifyContent: 'space-between',
    },
    swatchSurface: {
      height: spacing.sm + spacing.xs,
      borderRadius: borderRadius.sm,
    },
    swatchAccent: {
      width: '55%',
      height: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    swatchAccentSecondary: {
      position: 'absolute',
      right: spacing.xs,
      bottom: spacing.xs,
      width: spacing.sm + spacing.xs,
      height: spacing.sm + spacing.xs,
      borderRadius: borderRadius.sm,
    },
    appearanceText: {
      flex: 1,
    },
    appearanceLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    appearanceSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.caption,
    },
    radioIdle: {
      width: iconSizes.lg,
      height: iconSizes.lg,
      borderRadius: borderRadius.pill,
      borderWidth: borderWidths.strong,
      borderColor: colors.border,
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
      color: colors.navy,
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

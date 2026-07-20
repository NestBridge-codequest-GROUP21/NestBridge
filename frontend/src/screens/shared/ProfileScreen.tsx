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
import { profileCopy } from '../../data/appCopy';
import {
  useTheme,
  useThemedStyles,
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
  icon: 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline';
}[] = [
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Always use the NestBridge light look',
    icon: 'sunny-outline',
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Always use dark surfaces with brand accents',
    icon: 'moon-outline',
  },
  {
    id: 'system',
    label: 'System',
    subtitle: 'Match your device light or dark setting',
    icon: 'phone-portrait-outline',
  },
];

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
  const { preference, setPreference, scheme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Profile"
        userName={userName}
        userInitials={userInitials}
        subtitle="Account and setup"
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
                <View style={styles.appearanceIcon}>
                  <AppIcon
                    name={option.icon}
                    size={iconSizes.md}
                    color={selected ? styles._teal : styles._muted}
                  />
                </View>
                <View style={styles.appearanceText}>
                  <Text style={styles.appearanceLabel}>{option.label}</Text>
                  <Text style={styles.appearanceSubtitle}>{option.subtitle}</Text>
                  {option.id === 'system' ? (
                    <Text style={styles.appearanceHint}>
                      Currently using {scheme} mode
                    </Text>
                  ) : null}
                </View>
                {selected ? (
                  <AppIcon
                    name="checkmark-circle"
                    size={iconSizes.lg}
                    color={styles._teal}
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

function createStyles({ colors }: AppTheme) {
  const sheet = StyleSheet.create({
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
    appearanceIcon: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      backgroundColor: colors.warmCream,
      alignItems: 'center',
      justifyContent: 'center',
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
    appearanceHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.teal,
      marginTop: spacing.xs,
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

  return {
    ...sheet,
    _teal: colors.teal,
    _muted: colors.textTertiary,
  };
}

import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import ScreenScroll from '../../components/ScreenScroll';
import BrandLogo from '../../components/BrandLogo';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
  iconSizes,
} from '../../constants/theme';
import { openNestBridgeSupportEmail as openSupportEmail } from '../../utils/supportEmail';

export interface VerifyEmailScreenProps {
  email: string;
  title?: string;
  subtitle?: string;
  statusMessage?: string;
  errorMessage?: string;
  resendBusy?: boolean;
  onResend?: () => void;
  onChangeEmail?: () => void;
  onBackToSignIn?: () => void;
}

export default function VerifyEmailScreen({
  email,
  title = 'Check your inbox',
  subtitle = 'Open the verification link we sent, then come back and sign in to NestBridge.',
  statusMessage,
  errorMessage,
  resendBusy = false,
  onResend,
  onChangeEmail,
  onBackToSignIn,
}: VerifyEmailScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenScroll
        keyboardAware={false}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <BrandLogo size="sm" style={styles.brandLogo} />

        <View style={styles.iconCircle}>
          <AppIcon name="mail-outline" size={iconSizes.xl} color={colors.onAccent} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Card style={styles.emailCard}>
          <Text style={styles.emailLabel}>Sent to</Text>
          <Text style={styles.emailValue}>{email}</Text>
        </Card>

        {statusMessage ? <InlineBanner message={statusMessage} tone="success" /> : null}
        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

        <Text style={styles.hint}>
          Didn’t get it? Check spam, or resend the verification email below.
        </Text>

        <PrimaryButton
          label="Resend verification email"
          onPress={onResend}
          loading={resendBusy}
        />

        {onChangeEmail ? (
          <View style={styles.secondaryWrap}>
            <SecondaryButton label="Change email" onPress={onChangeEmail} />
          </View>
        ) : null}

        <View style={styles.secondaryWrap}>
          <SecondaryButton label="Back to sign in" onPress={onBackToSignIn} />
        </View>
      </ScreenScroll>
    </View>
  );
}

export async function openNestBridgeSupportEmail(accountEmail?: string): Promise<void> {
  return openSupportEmail(
    accountEmail,
    'NestBridge verification help',
    'I need help verifying my account.',
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: layout.screenPaddingHorizontal,
      gap: spacing.md,
    },
    brandLogo: {
      alignSelf: 'center',
      marginBottom: spacing.sm,
    },
    iconCircle: {
      width: layout.iconTileSize,
      height: layout.iconTileSize,
      borderRadius: borderRadius.pill,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.heading,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: lineHeights.body,
    },
    emailCard: {
      marginTop: spacing.sm,
    },
    emailLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      marginBottom: spacing.xs,
    },
    emailValue: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    hint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: lineHeights.caption,
      marginTop: spacing.sm,
    },
    secondaryWrap: {
      marginTop: spacing.sm,
    },
  });
}

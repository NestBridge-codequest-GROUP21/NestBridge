import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  Alert,
  Share,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
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
  touchTarget,
} from '../../constants/theme';

export interface VerifyEmailScreenProps {
  email: string;
  title?: string;
  subtitle?: string;
  statusMessage?: string;
  errorMessage?: string;
  resendBusy?: boolean;
  onResend?: () => void;
  onChangeEmail?: () => void;
  onContactSupport?: () => void;
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
  onContactSupport,
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

        {onContactSupport ? (
          <Pressable
            onPress={onContactSupport}
            style={styles.supportRow}
            accessibilityRole="link"
            accessibilityLabel="Contact support"
          >
            <Text style={styles.supportText}>Contact support</Text>
          </Pressable>
        ) : null}
      </ScreenScroll>
    </View>
  );
}

export const NESTBRIDGE_SUPPORT_EMAIL = 'support@nestbridge.app';

/** Opens the device mail app, then Gmail-in-browser, then a share/copy fallback. */
export async function openNestBridgeSupportEmail(accountEmail?: string): Promise<void> {
  const subject = 'NestBridge verification help';
  const body = accountEmail?.trim()
    ? `Hi NestBridge team,\n\nI need help verifying my account.\n\nAccount email: ${accountEmail.trim()}\n`
    : 'Hi NestBridge team,\n\nI need help verifying my account.\n';
  const mailto = `mailto:${NESTBRIDGE_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) {
      await Linking.openURL(mailto);
      return;
    }
  } catch {
    // Android 11+ may reject canOpenURL without mailto queries; still try openURL.
    try {
      await Linking.openURL(mailto);
      return;
    } catch {
      // Fall through to browser / share.
    }
  }

  try {
    await WebBrowser.openBrowserAsync(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(NESTBRIDGE_SUPPORT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    return;
  } catch {
    // Fall through to alert.
  }

  Alert.alert(
    'Contact NestBridge support',
    `Email us at ${NESTBRIDGE_SUPPORT_EMAIL} and include a screenshot of this screen.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Share address',
        onPress: () => {
          void Share.share({
            message: NESTBRIDGE_SUPPORT_EMAIL,
            title: 'NestBridge support',
          });
        },
      },
    ],
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
    supportRow: {
      minHeight: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    supportText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
  });
}

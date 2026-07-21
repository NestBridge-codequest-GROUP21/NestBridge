import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import DemoActorQuickLogin from '../../components/DemoActorQuickLogin';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import CheckboxRow from '../../components/CheckboxRow';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  layout,
  touchTarget,
} from '../../constants/theme';
import type { DemoAccount } from '../../data/demoAccounts';

export interface LoginScreenProps {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  keepSignedIn: boolean;
  errorMessage?: string;
  /** When true, show resend verification under the error banner. */
  showResendVerification?: boolean;
  resendBusy?: boolean;
  /** Shown as muted footer text so installs can be verified (e.g. APK builds). */
  appVersion?: string;
  demoAccounts?: DemoAccount[];
  demoLoginBusy?: boolean;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onToggleKeepSignedIn?: () => void;
  onSubmit?: () => void;
  onResendVerification?: () => void;
  onDemoLogin?: (account: DemoAccount) => void;
  onForgotPasswordPress?: () => void;
  onCreateAccountPress?: () => void;
  onBack?: () => void;
}

export default function LoginScreen({
  title,
  subtitle,
  email,
  password,
  keepSignedIn,
  errorMessage,
  showResendVerification = false,
  resendBusy = false,
  appVersion,
  demoAccounts = [],
  demoLoginBusy = false,
  onEmailChange,
  onPasswordChange,
  onToggleKeepSignedIn,
  onSubmit,
  onResendVerification,
  onDemoLogin,
  onForgotPasswordPress,
  onCreateAccountPress,
  onBack,
}: LoginScreenProps) {
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + layout.authContentTop },
        ]}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {demoAccounts.length > 0 ? (
          <>
            <DemoActorQuickLogin
              accounts={demoAccounts}
              busy={demoLoginBusy}
              variant="tabs"
              onSelect={onDemoLogin}
            />
            <Text style={styles.dividerLabel}>or sign in with email</Text>
          </>
        ) : null}

        <FormTextField
          label="Email"
          value={email}
          placeholder="you@example.com"
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormTextField
          label="Password"
          value={password}
          placeholder="Your password"
          onChangeText={onPasswordChange}
          secureTextEntry
          visibilityToggle
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />

        {onForgotPasswordPress ? (
          <Pressable
            onPress={onForgotPasswordPress}
            style={styles.forgotRow}
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        ) : null}

        <CheckboxRow
          label="Keep me signed in"
          checked={keepSignedIn}
          onPress={onToggleKeepSignedIn}
          style={styles.keepSignedIn}
        />

        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

        {showResendVerification ? (
          <View style={styles.resendWrap}>
            <SecondaryButton
              label="Resend verification email"
              onPress={onResendVerification}
              disabled={demoLoginBusy || resendBusy}
            />
          </View>
        ) : null}

        <PrimaryButton label="Sign in" onPress={onSubmit} loading={demoLoginBusy} />
        <View style={styles.spacer} />
        <SecondaryButton
          label="Create an account"
          onPress={onCreateAccountPress}
          disabled={demoLoginBusy}
        />
        {appVersion ? (
          <Text style={styles.versionText}>NestBridge {appVersion}</Text>
        ) : null}
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
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  back: {
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.display,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  dividerLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    minHeight: touchTarget,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  forgotText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
  keepSignedIn: {
    marginBottom: spacing.lg,
  },
  resendWrap: {
    marginBottom: spacing.md,
  },
  spacer: {
    height: spacing.sm,
  },
  versionText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    fontFamily: fontFamilies.regular,
    color: colors.textTertiary,
  },
});
}


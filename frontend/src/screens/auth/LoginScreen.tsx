import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import DemoActorQuickLogin from '../../components/DemoActorQuickLogin';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
} from '../../constants/theme';
import type { DemoAccount } from '../../data/demoAccounts';

export interface LoginScreenProps {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  keepSignedIn: boolean;
  errorMessage?: string;
  /** Shown as muted footer text so installs can be verified (e.g. APK builds). */
  appVersion?: string;
  demoAccounts?: DemoAccount[];
  demoLoginBusy?: boolean;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onToggleKeepSignedIn?: () => void;
  onSubmit?: () => void;
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
  appVersion,
  demoAccounts = [],
  demoLoginBusy = false,
  onEmailChange,
  onPasswordChange,
  onToggleKeepSignedIn,
  onSubmit,
  onDemoLogin,
  onForgotPasswordPress,
  onCreateAccountPress,
  onBack,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        <Pressable
          onPress={onToggleKeepSignedIn}
          style={styles.keepSignedInRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: keepSignedIn }}
        >
          <View style={[styles.checkbox, keepSignedIn && styles.checkboxChecked]}>
            {keepSignedIn ? (
              <AppIcon name="checkmark" size={14} color={colors.white} />
            ) : null}
          </View>
          <Text style={styles.keepSignedInText}>Keep me signed in</Text>
        </Pressable>

        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

        <PrimaryButton label="Sign in" onPress={onSubmit} />
        <View style={styles.spacer} />
        <SecondaryButton label="Create an account" onPress={onCreateAccountPress} />
        {appVersion ? (
          <Text style={styles.versionText}>NestBridge {appVersion}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  forgotText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
  keepSignedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: 44,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  keepSignedInText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  spacer: {
    height: spacing.sm,
  },
  versionText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: fontSizes.caption,
    fontFamily: fontFamilies.regular,
    color: colors.textTertiary,
  },
});

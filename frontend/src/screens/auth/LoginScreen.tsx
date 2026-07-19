import React, { useState } from 'react';
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
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
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
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        ) : null}

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
          placeholder="Enter email address..."
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormTextField
          label="Password"
          value={password}
          placeholder="Enter your password..."
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
            {keepSignedIn ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.keepSignedInText}>Keep me signed in</Text>
        </Pressable>

        {errorMessage ? (
          <View style={styles.errorBanner} accessibilityLiveRegion="polite">
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

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
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: 20,
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
  checkmark: {
    color: colors.white,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  keepSignedInText: {
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: colors.warmCream,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    lineHeight: 20,
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

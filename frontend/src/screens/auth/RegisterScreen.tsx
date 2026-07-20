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
import DemoActorQuickLogin from '../../components/DemoActorQuickLogin';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import type { DemoAccount } from '../../data/demoAccounts';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
  shadows,
} from '../../constants/theme';

export interface RegisterScreenProps {
  title: string;
  subtitle: string;
  fullName: string;
  email: string;
  password: string;
  keepSignedIn: boolean;
  errorMessage?: string;
  demoAccounts?: DemoAccount[];
  demoLoginBusy?: boolean;
  onDemoLogin?: (account: DemoAccount) => void;
  onFullNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onToggleKeepSignedIn?: () => void;
  onSubmit?: () => void;
  onSignInPress?: () => void;
  onBack?: () => void;
}

export default function RegisterScreen({
  title,
  subtitle,
  fullName,
  email,
  password,
  keepSignedIn,
  errorMessage,
  demoAccounts = [],
  demoLoginBusy = false,
  onDemoLogin,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onToggleKeepSignedIn,
  onSubmit,
  onSignInPress,
  onBack,
}: RegisterScreenProps) {
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
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.formCard}>
          <FormTextField
            label="Full name"
            value={fullName}
            placeholder="e.g. Akosua Darko"
            onChangeText={onFullNameChange}
            autoCapitalize="words"
          />
          <FormTextField
            label="Email address"
            value={email}
            placeholder="you@example.com"
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormTextField
            label="Password"
            value={password}
            placeholder="At least 6 characters"
            onChangeText={onPasswordChange}
            secureTextEntry
            visibilityToggle
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />

          <Pressable
            style={styles.checkboxRow}
            onPress={onToggleKeepSignedIn}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: keepSignedIn }}
          >
            <View style={[styles.checkbox, keepSignedIn && styles.checkboxChecked]}>
              {keepSignedIn ? (
                <AppIcon name="checkmark" size={14} color={colors.white} />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>Keep me signed in on this device</Text>
          </Pressable>
        </View>

        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

        <PrimaryButton label="Create account" onPress={onSubmit} />

        {demoAccounts.length > 0 ? (
          <View style={styles.demoWrap}>
            <DemoActorQuickLogin
              accounts={demoAccounts}
              busy={demoLoginBusy}
              variant="tabs"
              title="Or use quick sign-in"
              onSelect={onDemoLogin}
            />
          </View>
        ) : null}

        <Pressable onPress={onSignInPress} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLinkBold}>Sign in</Text>
          </Text>
        </Pressable>
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
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
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
  checkboxLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  demoWrap: {
    marginTop: spacing.lg,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
});

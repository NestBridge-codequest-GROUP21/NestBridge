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
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  tints,
} from '../../constants/theme';
import type { DemoAccount } from '../../data/demoAccounts';

export interface LoginScreenProps {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  keepSignedIn: boolean;
  errorMessage?: string;
  demoAccounts?: DemoAccount[];
  demoLoginBusy?: boolean;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onToggleKeepSignedIn?: () => void;
  onSubmit?: () => void;
  onDemoLogin?: (account: DemoAccount) => void;
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
  demoAccounts = [],
  demoLoginBusy = false,
  onEmailChange,
  onPasswordChange,
  onToggleKeepSignedIn,
  onSubmit,
  onDemoLogin,
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
        />

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

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <PrimaryButton label="Sign in" onPress={onSubmit} />
        <View style={styles.spacer} />
        <SecondaryButton label="Create an account" onPress={onCreateAccountPress} />

        {demoAccounts.length > 0 ? (
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Try a demo account</Text>
            <Text style={styles.demoHint}>
              One-tap sign-in as each actor. Password for all: password
            </Text>
            {demoAccounts.map((account) => (
              <Pressable
                key={account.id}
                style={({ pressed }) => [
                  styles.demoCard,
                  pressed && styles.demoCardPressed,
                  demoLoginBusy && styles.demoCardDisabled,
                ]}
                onPress={() => onDemoLogin?.(account)}
                disabled={demoLoginBusy}
                accessibilityRole="button"
                accessibilityLabel={`Sign in as demo ${account.label}, ${account.name}`}
              >
                <View style={styles.demoCardTop}>
                  <View style={styles.demoRolePill}>
                    <Text style={styles.demoRoleText}>{account.label}</Text>
                  </View>
                  <Text style={styles.demoName}>{account.name}</Text>
                </View>
                <Text style={styles.demoDescription}>{account.description}</Text>
              </Pressable>
            ))}
          </View>
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
    marginBottom: spacing.xl,
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
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  spacer: {
    height: spacing.sm,
  },
  demoSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  demoHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  demoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  demoCardPressed: {
    opacity: 0.94,
    backgroundColor: tints.teal,
  },
  demoCardDisabled: {
    opacity: 0.6,
  },
  demoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  demoRolePill: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  demoRoleText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  demoName: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  demoDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

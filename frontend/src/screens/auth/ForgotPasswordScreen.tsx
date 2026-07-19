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
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface ForgotPasswordScreenProps {
  email: string;
  errorMessage?: string;
  statusMessage?: string;
  submitting?: boolean;
  onEmailChange?: (value: string) => void;
  onSubmit?: () => void;
  onBack?: () => void;
}

export default function ForgotPasswordScreen({
  email,
  errorMessage,
  statusMessage,
  submitting = false,
  onEmailChange,
  onSubmit,
  onBack,
}: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const sent = !!statusMessage && !errorMessage;

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

        <Text style={styles.title}>{sent ? 'Check your inbox' : 'Forgot password?'}</Text>
        <Text style={styles.subtitle}>
          {sent
            ? 'If an account exists for this email, we sent a reset link. Open it on this device, then set a new password in the app.'
            : 'Enter your email and we will send a link to reset your password.'}
        </Text>

        {sent ? (
          <View style={styles.emailCard}>
            <Text style={styles.emailLabel}>Sent to</Text>
            <Text style={styles.emailValue}>{email}</Text>
          </View>
        ) : (
          <FormTextField
            label="Email"
            value={email}
            placeholder="Enter email address..."
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}

        {sent ? (
          <SecondaryButton label="Back to sign in" onPress={onBack} />
        ) : (
          <PrimaryButton
            label={submitting ? 'Sending…' : 'Send reset link'}
            onPress={onSubmit}
            disabled={submitting}
          />
        )}
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
  emailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  emailLabel: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  emailValue: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  statusText: {
    fontSize: fontSizes.body,
    color: colors.success,
    marginBottom: spacing.md,
  },
});

import React from 'react';
import {
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
import { colors, fontSizes, fontWeights, spacing } from '../../constants/theme';

export interface ResetPasswordScreenProps {
  password: string;
  confirmPassword: string;
  errorMessage?: string;
  statusMessage?: string;
  submitting?: boolean;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit?: () => void;
  onBack?: () => void;
}

export default function ResetPasswordScreen({
  password,
  confirmPassword,
  errorMessage,
  statusMessage,
  submitting = false,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBack,
}: ResetPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const success = !!statusMessage && !errorMessage;

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

        <Text style={styles.title}>{success ? 'Password updated' : 'Set a new password'}</Text>
        <Text style={styles.subtitle}>
          {success
            ? 'Your password was updated. Sign in with your new password.'
            : 'Choose a new password for your NestBridge account.'}
        </Text>

        {success ? (
          <SecondaryButton label="Back to sign in" onPress={onBack} />
        ) : (
          <>
            <FormTextField
              label="New password"
              value={password}
              placeholder="At least 6 characters"
              onChangeText={onPasswordChange}
              secureTextEntry
              visibilityToggle
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />
            <FormTextField
              label="Confirm password"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChangeText={onConfirmPasswordChange}
              secureTextEntry
              visibilityToggle
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <PrimaryButton
              label={submitting ? 'Saving…' : 'Update password'}
              onPress={onSubmit}
              disabled={submitting}
            />
          </>
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
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
});

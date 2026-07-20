import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
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
  shadows,
  tints,
} from '../../constants/theme';

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
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        {sent ? (
          <View style={styles.iconTile}>
            <AppIcon name="mail-open-outline" size={28} color={colors.tealDeep} />
          </View>
        ) : null}

        <Text style={styles.title}>{sent ? 'Check your inbox' : 'Forgot password?'}</Text>
        <Text style={styles.subtitle}>
          {sent
            ? 'If an account exists for this email, we sent a reset link. Open it on this device, then set a new password in the app.'
            : 'Enter the email on your NestBridge account and we will send a reset link.'}
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
            placeholder="you@example.com"
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}
        {statusMessage ? <InlineBanner message={statusMessage} tone="success" /> : null}

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
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  back: {
    marginBottom: spacing.sm,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
    marginBottom: spacing.xl,
  },
  emailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
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
});

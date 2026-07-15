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
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface VerifyEmailScreenProps {
  email: string;
  title?: string;
  subtitle?: string;
  statusMessage?: string;
  errorMessage?: string;
  resendBusy?: boolean;
  onResend?: () => void;
  onBackToSignIn?: () => void;
}

export default function VerifyEmailScreen({
  email,
  title = 'Check your inbox',
  subtitle = 'We sent a verification link to your email. Open it on this device, then return here to sign in.',
  statusMessage,
  errorMessage,
  resendBusy = false,
  onResend,
  onBackToSignIn,
}: VerifyEmailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✉️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.emailCard}>
          <Text style={styles.emailLabel}>Sent to</Text>
          <Text style={styles.emailValue}>{email}</Text>
        </View>

        {statusMessage ? (
          <View style={styles.statusBanner}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Text style={styles.hint}>
          Did not receive it? Check spam, or resend the link below.
        </Text>

        <PrimaryButton
          label={resendBusy ? 'Sending…' : 'Resend verification email'}
          onPress={onResend}
          disabled={resendBusy}
        />

        <View style={styles.secondaryWrap}>
          <SecondaryButton label="Back to sign in" onPress={onBackToSignIn} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  iconText: {
    fontSize: fontSizes.display,
  },
  title: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
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
  statusBanner: {
    backgroundColor: colors.success + '18',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  statusText: {
    color: colors.success,
    fontSize: fontSizes.caption,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: colors.danger + '14',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.caption,
    textAlign: 'center',
  },
  hint: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  secondaryWrap: {
    marginTop: spacing.sm,
  },
});

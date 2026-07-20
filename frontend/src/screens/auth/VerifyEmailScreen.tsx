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
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
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
  subtitle = 'Open the verification link we sent, then come back and sign in to NestBridge.',
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
          <AppIcon name="mail-outline" size={32} color={colors.tealDeep} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.emailCard}>
          <Text style={styles.emailLabel}>Sent to</Text>
          <Text style={styles.emailValue}>{email}</Text>
        </View>

        {statusMessage ? <InlineBanner message={statusMessage} tone="success" /> : null}
        {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

        <Text style={styles.hint}>
          Didn’t get it? Check spam, or resend the verification email below.
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
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
});

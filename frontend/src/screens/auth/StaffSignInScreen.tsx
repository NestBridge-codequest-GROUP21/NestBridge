import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import ScreenScroll from '../../components/ScreenScroll';
import BrandLogo from '../../components/BrandLogo';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
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

export interface StaffSignInScreenProps {
  email: string;
  password: string;
  keepSignedIn: boolean;
  errorMessage?: string;
  submitting?: boolean;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onToggleKeepSignedIn?: () => void;
  onSubmit?: () => void;
  onForgotPasswordPress: () => void;
  onBack?: () => void;
}

export default function StaffSignInScreen({
  email,
  password,
  keepSignedIn,
  errorMessage,
  submitting = false,
  onEmailChange,
  onPasswordChange,
  onToggleKeepSignedIn,
  onSubmit,
  onForgotPasswordPress,
  onBack,
}: StaffSignInScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const showCredentialError = Boolean(errorMessage?.trim());

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + layout.authContentTop },
        ]}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <BrandLogo size="sm" style={styles.brandLogo} />

        <Text style={styles.kicker}>Staff portal</Text>
        <Text style={styles.title}>Sign in to ops</Text>
        <Text style={styles.subtitle}>
          For NestBridge staff only. This portal is separate from student, host, guide, and
          tourist accounts.
        </Text>

        <FormTextField
          label="Staff email"
          value={email}
          placeholder="bsbhackman@gmail.com"
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormTextField
          label="Password"
          value={password}
          placeholder="••••••••"
          onChangeText={onPasswordChange}
          secureTextEntry
          visibilityToggle
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />

        <Pressable
          onPress={onForgotPasswordPress}
          style={styles.forgotRow}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <CheckboxRow
          label="Keep me signed in"
          checked={keepSignedIn}
          onPress={onToggleKeepSignedIn}
        />

        {showCredentialError ? (
          <View style={styles.errorBlock}>
            <InlineBanner tone="error" message={errorMessage!} />
            <SecondaryButton
              label="Forgot password?"
              onPress={onForgotPasswordPress}
              disabled={submitting}
            />
          </View>
        ) : null}

        <PrimaryButton
          label={submitting ? 'Signing in…' : 'Sign in to ops'}
          onPress={onSubmit}
          disabled={submitting}
        />

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.footerLink, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.footerLinkText}>Back to NestBridge app sign-in</Text>
        </Pressable>
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
      paddingBottom: spacing.xxl,
      gap: spacing.md,
    },
    back: {
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    brandLogo: {
      marginBottom: spacing.sm,
    },
    kicker: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.bold,
      color: colors.textPrimary,
      lineHeight: lineHeights.heading,
    },
    subtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
      marginBottom: spacing.sm,
    },
    forgotRow: {
      alignSelf: 'flex-end',
      minHeight: touchTarget,
      justifyContent: 'center',
      marginTop: -spacing.sm,
    },
    forgotText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    errorBlock: {
      gap: spacing.sm,
    },
    footerLink: {
      minHeight: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    footerLinkText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}

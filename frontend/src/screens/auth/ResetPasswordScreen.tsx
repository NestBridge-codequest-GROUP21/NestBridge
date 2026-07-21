import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import ScreenScroll from '../../components/ScreenScroll';
import BrandLogo from '../../components/BrandLogo';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
  iconSizes,
} from '../../constants/theme';

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
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();


  const insets = useSafeAreaInsets();
  const success = !!statusMessage && !errorMessage;

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <BrandLogo size="sm" style={styles.brandLogo} />

        {success ? (
          <View style={styles.iconTile}>
            <AppIcon
              name="checkmark-circle-outline"
              size={iconSizes.xl}
              color={colors.success}
            />
          </View>
        ) : null}

        <Text style={styles.title}>{success ? 'Password updated' : 'Set a new password'}</Text>
        <Text style={styles.subtitle}>
          {success
            ? 'Your password was updated. Sign in with your new password to continue.'
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

            {errorMessage ? <InlineBanner message={errorMessage} tone="error" /> : null}

            <PrimaryButton
              label="Update password"
              onPress={onSubmit}
              loading={submitting}
            />
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
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
  brandLogo: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  iconTile: {
    width: layout.iconTileSize,
    height: layout.iconTileSize,
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
    lineHeight: lineHeights.display,
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
});
}


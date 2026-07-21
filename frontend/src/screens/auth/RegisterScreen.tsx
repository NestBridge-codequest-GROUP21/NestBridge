import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormTextField from '../../components/FormTextField';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import DemoActorQuickLogin from '../../components/DemoActorQuickLogin';
import BackButton from '../../components/BackButton';
import InlineBanner from '../../components/InlineBanner';
import CheckboxRow from '../../components/CheckboxRow';
import type { DemoAccount } from '../../data/demoAccounts';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  layout,
  touchTarget,
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
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + layout.authContentTop },
        ]}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

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

        <CheckboxRow
          label="Keep me signed in on this device"
          checked={keepSignedIn}
          onPress={onToggleKeepSignedIn}
          style={styles.checkboxRow}
        />

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
  },
  back: {
    marginBottom: spacing.sm,
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
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  checkboxRow: {
    marginBottom: spacing.lg,
  },
  demoWrap: {
    marginTop: spacing.lg,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});
}


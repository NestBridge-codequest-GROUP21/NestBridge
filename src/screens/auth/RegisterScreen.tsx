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
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface RegisterScreenProps {
  title: string;
  subtitle: string;
  fullName: string;
  email: string;
  password: string;
  keepSignedIn: boolean;
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
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn} accessibilityRole="button">
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        )}

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
            placeholder="Enter email address..."
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormTextField
            label="Password"
            value={password}
            placeholder="Create a password..."
            onChangeText={onPasswordChange}
            secureTextEntry
          />

          <Pressable
            style={styles.checkboxRow}
            onPress={onToggleKeepSignedIn}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: keepSignedIn }}
          >
            <View style={[styles.checkbox, keepSignedIn && styles.checkboxChecked]}>
              {keepSignedIn && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Keep me signed in on this device</Text>
          </Pressable>
        </View>

        <PrimaryButton label="Create Account →" onPress={onSubmit} />

        <Pressable onPress={onSignInPress} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLinkBold}>Sign In</Text>
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
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
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
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
  checkmark: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
});

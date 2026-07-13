import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { KYCPromptData } from '../../data/kycPromptMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
} from '../../constants/theme';

export interface KYCPromptScreenProps {
  data: KYCPromptData;
  onVerifyNow?: () => void;
  onVerifyLater?: () => void;
  onSosPress?: () => void;
}

export default function KYCPromptScreen({
  data,
  onVerifyNow,
  onVerifyLater,
}: KYCPromptScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View
        style={[
          styles.topSection,
          { paddingTop: insets.top + spacing.xl },
        ]}
      >
        <Text style={styles.roleLabel}>{data.roleLabel}</Text>
        <Text style={styles.heading}>{data.message}</Text>
        <Text style={styles.explanation}>{data.explanation}</Text>
      </View>

      <View style={styles.iconContainer} accessibilityLabel="Identity verification">
        <Text style={styles.icon}>🪪</Text>
      </View>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={onVerifyNow}
          accessibilityRole="button"
          accessibilityLabel="Verify now"
        >
          <Text style={styles.primaryButtonText}>Verify now</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={onVerifyLater}
          accessibilityRole="button"
          accessibilityLabel="Verify later"
        >
          <Text style={styles.secondaryButtonText}>Verify later</Text>
        </Pressable>

        <Text style={styles.note}>{data.note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: layout.screenPaddingHorizontal,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
  },
  roleLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display - 6,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  explanation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body - 1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: spacing.xl * 2 + spacing.sm,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  secondaryButton: {
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.teal,
  },
  secondaryButtonText: {
    fontFamily: fontFamilies.semibold,
    color: colors.teal,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
  },
  note: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
  pressed: {
    opacity: 0.88,
  },
});

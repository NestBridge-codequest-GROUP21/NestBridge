import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PrimaryButton from './PrimaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
} from '../constants/theme';

export interface ProfileIncompleteBannerProps {
  message: string;
  continueLabel?: string;
  onContinueSetup?: () => void;
}

export default function ProfileIncompleteBanner({
  message,
  continueLabel = 'Continue setup',
  onContinueSetup,
}: ProfileIncompleteBannerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      {onContinueSetup ? (
        <Pressable
          onPress={onContinueSetup}
          style={styles.linkButton}
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
        >
          <Text style={styles.linkText}>{continueLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export interface GatedPrimaryButtonProps {
  label: string;
  blocked: boolean;
  blockedMessage: string;
  onPress?: () => void;
  onContinueSetup?: () => void;
}

export function GatedPrimaryButton({
  label,
  blocked,
  blockedMessage,
  onPress,
  onContinueSetup,
}: GatedPrimaryButtonProps) {
  if (blocked) {
    return (
      <View style={styles.gatedWrap}>
        <ProfileIncompleteBanner
          message={blockedMessage}
          onContinueSetup={onContinueSetup}
        />
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>{label}</Text>
        </View>
      </View>
    );
  }

  return <PrimaryButton label={label} onPress={onPress} />;
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  message: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  linkButton: {
    marginTop: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  gatedWrap: {
    width: '100%',
  },
  disabledButton: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  disabledButtonText: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textTertiary,
  },
});

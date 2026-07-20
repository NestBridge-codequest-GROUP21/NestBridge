import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import type { KYCPromptData } from '../../data/kycPromptMock';
import {
  colors,
  tints,
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
        <View style={styles.iconTile}>
          <AppIcon name="card-outline" size={64} color={colors.tealDeep} />
        </View>
      </View>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl },
        ]}
      >
        <PrimaryButton label="Verify now" onPress={onVerifyNow} />
        <SecondaryButton label="Verify later" onPress={onVerifyLater} />
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
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: lineHeights.heading,
  },
  explanation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTile: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  note: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
});

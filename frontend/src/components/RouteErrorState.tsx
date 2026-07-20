import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from './AppIcon';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  tints,
} from '../constants/theme';

export interface RouteErrorStateProps {
  message: string;
  title?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  onBack?: () => void;
  onRetry?: () => void;
}

export default function RouteErrorState({
  message,
  title = 'Something went wrong',
  isLoading = false,
  loadingLabel = 'Loading…',
  onBack,
  onRetry,
}: RouteErrorStateProps) {
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.root} accessibilityRole="progressbar" accessibilityLabel={loadingLabel}>
        <View style={styles.loadingTile}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
        <Text style={styles.loadingLabel}>{loadingLabel}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <View style={styles.iconTile}>
        <AppIcon name="cloud-offline-outline" size={28} color={colors.tealDeep} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        {onRetry ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}
        {onRetry && onBack ? <View style={styles.actionGap} /> : null}
        {onBack ? <SecondaryButton label="Go back" onPress={onBack} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  loadingTile: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  loadingLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  actions: {
    width: '100%',
  },
  actionGap: {
    height: spacing.sm,
  },
});

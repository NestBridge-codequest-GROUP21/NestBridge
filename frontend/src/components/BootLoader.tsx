import { useThemedStyles, type AppTheme, useTheme } from '../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BrandLogo from './BrandLogo';
import {
  spacing,
} from '../constants/theme';

function PulsingDot({ accent }: { accent?: boolean }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.dot, accent && styles.dotAccent]} />
  );
}

/** Minimal branded loader for font/auth bootstrap — not the full splash. */
export default function BootLoader() {
  const styles = useThemedStyles(createStyles);
  const { scheme } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <BrandLogo size="md" accessibilityLabel="NestBridge" />
      <View style={styles.dots} accessibilityRole="progressbar">
        <PulsingDot />
        <PulsingDot accent />
        <PulsingDot />
      </View>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.border,
    opacity: 0.55,
  },
  dotAccent: {
    backgroundColor: colors.teal,
    opacity: 0.95,
  },
});
}

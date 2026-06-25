import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '../constants/theme';

function PulsingDot({ accent }: { accent?: boolean }) {
  return (
    <View style={[styles.dot, accent && styles.dotAccent]} />
  );
}

/** Minimal loader for font/auth bootstrap — not the branded splash. */
export default function BootLoader() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.dots} accessibilityRole="progressbar">
        <PulsingDot />
        <PulsingDot accent />
        <PulsingDot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.white,
    opacity: 0.35,
  },
  dotAccent: {
    backgroundColor: colors.tealBright,
    opacity: 0.9,
  },
});

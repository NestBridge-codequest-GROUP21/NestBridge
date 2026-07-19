import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, borderRadius } from '../constants/theme';

export interface ProgressBarProps {
  /** 0–100. Clamped to that range. */
  percent: number;
  trackColor?: string;
  fillColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Slim horizontal progress bar. Fills left→right based on `percent`.
 */
export default function ProgressBar({
  percent,
  trackColor = colors.border,
  fillColor = colors.tealBright,
  height = 6,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <View
      style={[styles.track, { backgroundColor: trackColor, height }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: fillColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.pill,
  },
});

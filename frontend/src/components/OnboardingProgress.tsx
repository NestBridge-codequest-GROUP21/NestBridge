import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius, motion } from '../constants/theme';

export interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  stepLabel,
}: OnboardingProgressProps) {
  const progress = currentStep / totalSteps;
  const widthAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: motion.durationNormal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  const fillWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
        <Text style={styles.stepCount}>
          {currentStep} of {totalSteps}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stepCount: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.tealBright,
    borderRadius: borderRadius.pill,
  },
});

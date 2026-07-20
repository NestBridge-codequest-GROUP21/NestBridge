import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import {
  colors,
  borderRadius,
  borderWidths,
  spacing,
  motion,
  tints,
  avatarSizes,
} from '../constants/theme';

export interface SkeletonLoaderProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/** Subtle shimmer placeholder for progressive loading. */
export function SkeletonBlock({
  width = '100%',
  height = 16,
  borderRadius: radius = borderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: motion.durationNormal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: motion.durationNormal,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export interface SkeletonCardProps {
  style?: ViewStyle;
  lines?: number;
}

/** Card-shaped skeleton used on home and list screens. */
export default function SkeletonLoader({ style, lines = 3 }: SkeletonCardProps) {
  return (
    <View
      style={[styles.card, style]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <View style={styles.headerRow}>
        <SkeletonBlock
          width={avatarSizes.lg}
          height={avatarSizes.lg}
          borderRadius={borderRadius.pill}
        />
        <View style={styles.headerText}>
          <SkeletonBlock width="70%" height={spacing.md} />
          <SkeletonBlock
            width="45%"
            height={spacing.sm + spacing.xs}
            style={styles.lineGap}
          />
        </View>
      </View>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBlock
          key={`line-${index}`}
          width={index === lines - 1 ? '60%' : '100%'}
          height={12}
          style={styles.lineGap}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: tints.navy,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  lineGap: {
    marginTop: spacing.sm,
  },
});

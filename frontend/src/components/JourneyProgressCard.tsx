import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import AppIcon from './AppIcon';
import ProgressBar from './ProgressBar';
import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  layout,
} from '../constants/theme';
import type { JourneyProgress } from '../types/journeyProgress';

export interface JourneyProgressCardProps {
  journey: JourneyProgress;
}

/**
 * Read-only settle-in / trip readiness tracker.
 * Not a navigation hub — Explore owns catalogues and tips.
 */
export default function JourneyProgressCard({
  journey,
}: JourneyProgressCardProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <Card padding="lg" elevation="card" style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Progress</Text>
            <Text style={styles.title}>{journey.title}</Text>
            <Text style={styles.subtitle}>{journey.subtitle}</Text>
          </View>
          <View
            style={styles.percentBadge}
            accessibilityLabel={`${journey.percent} percent complete`}
          >
            <Text style={styles.percentValue}>{journey.percent}%</Text>
            <Text style={styles.percentLabel}>done</Text>
          </View>
        </View>

        <ProgressBar
          percent={journey.percent}
          height={8}
          fillColor={colors.tealBright}
          style={styles.bar}
        />

        <View style={styles.steps} pointerEvents="none">
          {journey.steps.map((step, index) => {
            const isLast = index === journey.steps.length - 1;
            return (
              <View
                key={step.id}
                style={[styles.stepRow, !isLast && styles.stepRowBorder]}
                accessibilityRole="text"
                accessibilityState={{ checked: step.completed, disabled: true }}
                accessibilityLabel={`${step.title}${step.completed ? ', completed' : `, ${step.subtitle}`}`}
              >
                <View
                  style={[
                    styles.stepIcon,
                    step.completed && styles.stepIconDone,
                  ]}
                >
                  {step.completed ? (
                    <AppIcon
                      name="checkmark"
                      size={iconSizes.sm}
                      color={colors.onPrimary}
                    />
                  ) : (
                    <AppIcon
                      glyph={step.iconGlyph}
                      size={iconSizes.sm}
                      color={colors.onAccent}
                    />
                  )}
                </View>
                <View style={styles.stepCopy}>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleDone,
                    ]}
                    numberOfLines={2}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle} numberOfLines={2}>
                    {step.completed ? 'Complete' : step.subtitle}
                  </Text>
                </View>
                {step.completed ? (
                  <View style={styles.stepStatus}>
                    <AppIcon
                      name="checkmark-circle"
                      size={iconSizes.md}
                      color={colors.success}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

function createStyles({ colors, tints, chrome }: AppTheme) {
  return StyleSheet.create({
    wrap: {
      marginBottom: layout.sectionGap,
    },
    card: {
      gap: spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    headerText: {
      flex: 1,
    },
    eyebrow: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: spacing.xs,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      lineHeight: lineHeights.subheading,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
    },
    percentBadge: {
      minWidth: touchTarget,
      minHeight: touchTarget,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    percentValue: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.onAccent,
    },
    percentLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.onAccent,
    },
    bar: {
      marginTop: spacing.xs,
    },
    steps: {
      marginTop: spacing.xs,
      borderRadius: borderRadius.md,
      borderWidth: chrome.minimalBorders ? 0 : borderWidths.hairline,
      borderColor: colors.border,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    stepRowBorder: {
      borderBottomWidth: chrome.minimalBorders ? 0 : borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    stepIcon: {
      width: iconSizes.xl,
      height: iconSizes.xl,
      borderRadius: borderRadius.pill,
      backgroundColor: chrome.solidAccentBlocks ? tints.teal : tints.cream,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
      flexShrink: 0,
    },
    stepIconDone: {
      backgroundColor: colors.success,
    },
    stepCopy: {
      flex: 1,
      minWidth: 0,
    },
    stepStatus: {
      marginTop: spacing.xs,
      flexShrink: 0,
    },
    stepTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      lineHeight: lineHeights.caption,
    },
    stepTitleDone: {
      color: colors.textSecondary,
    },
    stepSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textTertiary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.micro,
    },
  });
}

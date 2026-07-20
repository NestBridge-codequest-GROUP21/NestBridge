import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  touchTarget,
  iconSizes,
} from '../constants/theme';

export interface OnboardingNextStep {
  icon: string;
  title: string;
  body: string;
}

export interface OnboardingNextStepsCardProps {
  title?: string;
  steps: OnboardingNextStep[];
}

export default function OnboardingNextStepsCard({
  title = "Here's what happens next",
  steps,
}: OnboardingNextStepsCardProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {steps.map((step, index) => (
        <View
          key={step.title}
          style={[styles.row, index < steps.length - 1 && styles.rowBorder]}
        >
          <View style={styles.iconWrap}>
            <AppIcon
              glyph={step.icon}
              size={iconSizes.md}
              color={colors.tealDeep}
            />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{step.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    ...shadows.card,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
});
}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {steps.map((step, index) => (
        <View
          key={step.title}
          style={[styles.row, index < steps.length - 1 && styles.rowBorder]}
        >
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{step.icon}</Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fontSizes.subheading,
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

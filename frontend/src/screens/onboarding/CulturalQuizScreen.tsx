import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  lineHeights,
  layout,
  iconSizes,
  controlHeights,
} from '../../constants/theme';

export interface QuizOption {
  id: string;
  label: string;
  icon?: string;
}

export interface CulturalQuizScreenProps {
  currentStep: number;
  totalSteps: number;
  questionNumber: number;
  questionTotal: number;
  question: string;
  helperText: string;
  options: QuizOption[];
  selectedOptionId?: string;
  onSelectOption?: (optionId: string) => void;
  onContinue?: () => void;
  onBack?: () => void;
}

export default function CulturalQuizScreen({
  currentStep,
  totalSteps,
  questionNumber,
  questionTotal,
  question,
  helperText,
  options,
  selectedOptionId,
  onSelectOption,
  onContinue,
  onBack,
}: CulturalQuizScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();


  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabel="Cultural preferences"
        />

        <Text style={styles.questionMeta}>
          Question {questionNumber} of {questionTotal}
        </Text>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.helper}>{helperText}</Text>

        {options.map((option) => {
          const selected = option.id === selectedOptionId;
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.optionPressable,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => onSelectOption?.(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Card
                style={[styles.optionCard, selected && styles.optionCardSelected]}
              >
                {option.icon ? (
                  <AppIcon
                    glyph={option.icon}
                    size={iconSizes.lg}
                    color={selected ? colors.tealDeep : colors.teal}
                    style={styles.optionIcon}
                  />
                ) : null}
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
              </Card>
            </Pressable>
          );
        })}

        <View style={styles.footer}>
          <PrimaryButton
            label={questionNumber === questionTotal ? 'Finish quiz' : 'Next'}
            onPress={onContinue}
            disabled={!selectedOptionId}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  back: {
    marginBottom: spacing.sm,
  },
  questionMeta: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  question: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.sm,
  },
  helper: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  optionPressable: {
    marginBottom: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: controlHeights.lg + spacing.xs,
  },
  optionCardSelected: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
    backgroundColor: colors.warmCream,
  },
  optionCardPressed: {
    opacity: 0.95,
  },
  optionIcon: {
    marginRight: spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  footer: {
    marginTop: spacing.md,
  },
});
}


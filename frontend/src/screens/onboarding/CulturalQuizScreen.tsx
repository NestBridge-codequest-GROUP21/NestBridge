import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

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
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        )}

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
                styles.optionCard,
                selected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => onSelectOption?.(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}

        <View style={styles.footer}>
          <PrimaryButton
            label={questionNumber === questionTotal ? 'Finish quiz →' : 'Next →'}
            onPress={onContinue}
            disabled={!selectedOptionId}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  questionMeta: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  question: {
    fontSize: fontSizes.display - 2,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  helper: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 56,
  },
  optionCardSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  optionCardPressed: {
    opacity: 0.95,
  },
  optionIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.tealDeep,
  },
  footer: {
    marginTop: spacing.md,
  },
});

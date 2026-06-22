import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';
import { isLikelyValidText } from '../../utils/textValidation';

export type QuestionType = 'multi-select' | 'single-select' | 'slider' | 'text' | 'number';

export interface QuizQuestionShowWhen {
  fieldId: string;
  notEquals?: string;
  hideWhenEmpty?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  sliderLabels?: { min: string; max: string };
  placeholder?: string;
  defaultValue?: string | number | string[];
  showWhen?: QuizQuestionShowWhen;
}

export type QuizAnswers = Record<string, string | number | string[] | null>;

export interface QuizPageProps {
  questions: QuizQuestion[];
  pageNumber: number;
  totalPages: number;
  isLastPage?: boolean;
  savedAnswers?: QuizAnswers;
  showBack?: boolean;
  onContinue: (answers: QuizAnswers) => void;
  onBack?: (answers: QuizAnswers) => void;
  stepLabel?: string;
}

function getDefaultAnswer(question: QuizQuestion): string | number | string[] | null {
  if (question.defaultValue !== undefined) {
    return question.defaultValue;
  }
  switch (question.type) {
    case 'multi-select':
      return [];
    case 'slider':
      return 50;
    default:
      return '';
  }
}

function buildPageAnswers(questions: QuizQuestion[], savedAnswers?: QuizAnswers): QuizAnswers {
  return Object.fromEntries(
    questions.map((q) => {
      const saved = savedAnswers?.[q.id];
      if (saved !== undefined && saved !== null) {
        return [q.id, saved];
      }
      return [q.id, getDefaultAnswer(q)];
    }),
  );
}

function isAnswerEmpty(answer: string | number | string[] | null | undefined): boolean {
  if (answer === null || answer === undefined) {
    return true;
  }
  if (typeof answer === 'string') {
    return answer.trim().length === 0;
  }
  if (Array.isArray(answer)) {
    return answer.length === 0;
  }
  return false;
}

function isQuestionVisible(question: QuizQuestion, answers: QuizAnswers): boolean {
  const condition = question.showWhen;
  if (!condition) {
    return true;
  }

  const dependentValue = answers[condition.fieldId];
  if (condition.hideWhenEmpty && isAnswerEmpty(dependentValue)) {
    return false;
  }
  if (condition.notEquals !== undefined && dependentValue === condition.notEquals) {
    return false;
  }

  return true;
}

function getVisibleQuestions(questions: QuizQuestion[], answers: QuizAnswers): QuizQuestion[] {
  return questions.filter((question) => isQuestionVisible(question, answers));
}

function clearHiddenDependentAnswers(
  questions: QuizQuestion[],
  answers: QuizAnswers,
  changedFieldId: string,
): QuizAnswers {
  let next = answers;

  questions.forEach((question) => {
    if (question.showWhen?.fieldId !== changedFieldId) {
      return;
    }
    if (!isQuestionVisible(question, next)) {
      if (next === answers) {
        next = { ...answers };
      }
      next[question.id] = getDefaultAnswer(question);
    }
  });

  return next;
}

type FieldErrorKind = 'required' | 'gibberish';

function getFieldValidationError(
  question: QuizQuestion,
  answer: string | number | string[] | null | undefined,
  hasInteracted: boolean,
): FieldErrorKind | null {
  if (isRequiredAnswerMissing(question, answer, hasInteracted)) {
    return 'required';
  }

  if (
    question.type === 'text' &&
    question.required &&
    typeof answer === 'string' &&
    answer.trim().length > 0 &&
    !isLikelyValidText(answer)
  ) {
    return 'gibberish';
  }

  return null;
}

function isRequiredAnswerMissing(
  question: QuizQuestion,
  answer: string | number | string[] | null | undefined,
  hasInteracted: boolean,
): boolean {
  if (!question.required) {
    return false;
  }

  switch (question.type) {
    case 'multi-select':
      return !Array.isArray(answer) || answer.length === 0;
    case 'single-select':
      return answer === '' || answer === null || answer === undefined;
    case 'slider':
      return !hasInteracted;
    case 'text':
    case 'number':
      return typeof answer !== 'string' || answer.trim().length === 0;
    default:
      return isAnswerEmpty(answer);
  }
}

function buildInteractedFields(
  questions: QuizQuestion[],
  savedAnswers?: QuizAnswers,
): Record<string, boolean> {
  const interacted: Record<string, boolean> = {};

  questions.forEach((q) => {
    const saved = savedAnswers?.[q.id];
    if (saved === undefined || saved === null) {
      return;
    }
    if (q.type === 'slider') {
      interacted[q.id] = true;
      return;
    }
    if (q.type === 'multi-select') {
      if (Array.isArray(saved) && saved.length > 0) {
        interacted[q.id] = true;
      }
      return;
    }
    if (typeof saved === 'string' && saved.trim().length > 0) {
      interacted[q.id] = true;
    }
  });

  return interacted;
}

interface QuizSliderProps {
  value: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

function QuizSlider({ value, minLabel, maxLabel, onChange }: QuizSliderProps) {
  const trackWidth = useRef(0);

  const updateFromTouch = (locationX: number) => {
    if (trackWidth.current <= 0) {
      return;
    }
    const pct = Math.max(0, Math.min(100, (locationX / trackWidth.current) * 100));
    onChange(Math.round(pct));
  };

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  const handlePress = (event: GestureResponderEvent) => {
    updateFromTouch(event.nativeEvent.locationX);
  };

  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{minLabel}</Text>
        <Text style={styles.sliderLabel}>{maxLabel}</Text>
      </View>
      <Pressable
        onLayout={handleTrackLayout}
        onPress={handlePress}
        style={styles.sliderTrackPressable}
        accessibilityRole="adjustable"
        accessibilityLabel={`Slider value ${value}`}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${value}%` }]} />
          <View style={[styles.sliderThumb, { left: `${value}%` }]} />
        </View>
      </Pressable>
    </View>
  );
}

export default function QuizPage({
  questions,
  pageNumber,
  totalPages,
  isLastPage = false,
  savedAnswers,
  showBack = false,
  onContinue,
  onBack,
  stepLabel = 'Preferences',
}: QuizPageProps) {
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<QuizAnswers>(() =>
    buildPageAnswers(questions, savedAnswers),
  );
  const [interactedFields, setInteractedFields] = useState<Record<string, boolean>>(() =>
    buildInteractedFields(questions, savedAnswers),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, FieldErrorKind>>({});

  const visibleQuestions = getVisibleQuestions(questions, answers);

  const allSkippable = visibleQuestions.every((q) => !q.required);
  const showSingleSkip = visibleQuestions.length === 1 && !visibleQuestions[0].required;
  const showBundleSkip = visibleQuestions.length > 1 && allSkippable;

  const markInteracted = (id: string) => {
    setInteractedFields((prev) => ({ ...prev, [id]: true }));
  };

  const clearErrorIfValid = (question: QuizQuestion, value: string | number | string[] | null) => {
    setFieldErrors((prev) => {
      if (!prev[question.id]) {
        return prev;
      }
      if (getFieldValidationError(question, value, true) === null) {
        const next = { ...prev };
        delete next[question.id];
        return next;
      }
      return prev;
    });
  };

  const setAnswer = (id: string, value: string | number | string[] | null) => {
    setAnswers((prev) => {
      const next = clearHiddenDependentAnswers(questions, { ...prev, [id]: value }, id);
      const hiddenIds = questions
        .filter((q) => q.showWhen?.fieldId === id && !isQuestionVisible(q, next))
        .map((q) => q.id);
      if (hiddenIds.length > 0) {
        setFieldErrors((prevErrors) => {
          if (!hiddenIds.some((hiddenId) => prevErrors[hiddenId])) {
            return prevErrors;
          }
          const cleared = { ...prevErrors };
          hiddenIds.forEach((hiddenId) => delete cleared[hiddenId]);
          return cleared;
        });
      }
      return next;
    });
    markInteracted(id);
    const question = questions.find((q) => q.id === id);
    if (question) {
      clearErrorIfValid(question, value);
    }
  };

  const toggleMultiSelect = (id: string, option: string) => {
    const current = (answers[id] as string[]) ?? [];
    const next = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setAnswer(id, next);
  };

  const handleSkip = () => {
    const skipped: QuizAnswers = {};
    visibleQuestions.forEach((q) => {
      if (!q.required) {
        skipped[q.id] = isAnswerEmpty(answers[q.id]) ? null : answers[q.id];
      }
    });
    questions.forEach((q) => {
      if (!isQuestionVisible(q, answers)) {
        skipped[q.id] = null;
      }
    });
    setFieldErrors({});
    onContinue(skipped);
  };

  const handleContinuePress = () => {
    const errors: Record<string, FieldErrorKind> = {};

    visibleQuestions.forEach((q) => {
      const error = getFieldValidationError(q, answers[q.id], !!interactedFields[q.id]);
      if (error) {
        errors[q.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const outputAnswers: QuizAnswers = { ...answers };
    questions.forEach((q) => {
      if (!isQuestionVisible(q, answers)) {
        outputAnswers[q.id] = null;
      }
    });
    onContinue(outputAnswers);
  };

  const renderQuestionInput = (question: QuizQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'multi-select':
        return (
          <View style={styles.chipRow}>
            {(question.options ?? []).map((option) => {
              const selected = ((value as string[]) ?? []).includes(option);
              return (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                  onPress={() => toggleMultiSelect(question.id, option)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );

      case 'single-select':
        return (
          <View>
            {(question.options ?? []).map((option) => {
              const selected = value === option;
              return (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.optionCard,
                    selected && styles.optionCardSelected,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => setAnswer(question.id, option)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );

      case 'slider':
        return (
          <QuizSlider
            value={typeof value === 'number' ? value : 50}
            minLabel={question.sliderLabels?.min ?? 'Low'}
            maxLabel={question.sliderLabels?.max ?? 'High'}
            onChange={(next) => {
              markInteracted(question.id);
              setAnswers((prev) => ({ ...prev, [question.id]: next }));
              clearErrorIfValid(question, next);
            }}
          />
        );

      case 'number':
        return (
          <TextInput
            style={styles.textInput}
            value={String(value ?? '')}
            placeholder={question.placeholder}
            placeholderTextColor={colors.textTertiary}
            onChangeText={(text) => setAnswer(question.id, text)}
            keyboardType="numeric"
          />
        );

      case 'text':
      default:
        return (
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={String(value ?? '')}
            placeholder={question.placeholder}
            placeholderTextColor={colors.textTertiary}
            onChangeText={(text) => setAnswer(question.id, text)}
            multiline
          />
        );
    }
  };

  const progress = pageNumber / totalPages;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressWrap}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressStepLabel}>{stepLabel}</Text>
            <Text style={styles.progressCount}>
              Page {pageNumber} of {totalPages}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {visibleQuestions.map((question, index) => (
          <View key={question.id} style={index > 0 ? styles.questionSpacing : undefined}>
            <Text style={styles.question}>
              {question.question}
              {question.required && <Text style={styles.requiredMark}> *</Text>}
            </Text>
            {renderQuestionInput(question)}
            {fieldErrors[question.id] === 'required' && (
              <Text style={styles.fieldError}>This question is required</Text>
            )}
            {fieldErrors[question.id] === 'gibberish' && (
              <Text style={styles.fieldError}>
                This doesn&apos;t look like a valid answer — please check and try again
              </Text>
            )}
          </View>
        ))}

        {(showSingleSkip || showBundleSkip) && (
          <Pressable
            onPress={handleSkip}
            style={styles.skipLink}
            accessibilityRole="button"
            accessibilityLabel={
              showSingleSkip ? 'Skip this question' : 'Skip remaining questions on this page'
            }
          >
            <Text style={styles.skipLinkText}>
              {showSingleSkip ? 'Skip this question' : 'Skip remaining questions on this page'}
            </Text>
          </Pressable>
        )}

        <View style={styles.footer}>
          <PrimaryButton
            label={isLastPage ? 'Finish' : 'Continue'}
            onPress={handleContinuePress}
          />
          {showBack && onBack && (
            <>
              <View style={styles.footerSpacer} />
              <SecondaryButton label="Back" onPress={() => onBack(answers)} />
            </>
          )}
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
  progressWrap: {
    marginBottom: spacing.lg,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressStepLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  progressCount: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.tealBright,
    borderRadius: borderRadius.pill,
  },
  questionSpacing: {
    marginTop: spacing.lg,
  },
  question: {
    fontSize: fontSizes.display - 2,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  requiredMark: {
    color: colors.danger,
    fontWeight: fontWeights.bold,
  },
  fieldError: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  chipPressed: {
    opacity: 0.95,
  },
  chipLabel: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  chipLabelSelected: {
    color: colors.tealDeep,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 52,
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  optionCardPressed: {
    opacity: 0.95,
  },
  optionLabel: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.tealDeep,
  },
  sliderWrap: {
    marginTop: spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  sliderTrackPressable: {
    minHeight: 44,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.pill,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.teal,
    borderRadius: borderRadius.pill,
  },
  sliderThumb: {
    position: 'absolute',
    top: -9,
    width: 24,
    height: 24,
    marginLeft: -12,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  skipLink: {
    marginTop: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipLinkText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: spacing.lg,
  },
  footerSpacer: {
    height: spacing.sm,
  },
});

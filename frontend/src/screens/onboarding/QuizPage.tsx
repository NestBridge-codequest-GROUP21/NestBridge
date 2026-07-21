import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import ScreenScroll from '../../components/ScreenScroll';
import FocusAwareTextInput from '../../components/FocusAwareTextInput';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  controlHeights,
  touchTarget,
} from '../../constants/theme';
import { isLikelyValidPlaceName, isLikelyValidText } from '../../utils/textValidation';
import {
  isOtherOption,
  otherSpecifyKey,
} from './quizConstants';
import { validationCopy } from '../../data/appCopy';

export type QuestionType = 'multi-select' | 'single-select' | 'slider' | 'text' | 'number';

export interface QuizQuestionShowWhen {
  fieldId: string;
  equals?: string;
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
  textValidation?: 'place' | 'text';
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
  if (condition.equals !== undefined && dependentValue !== condition.equals) {
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

type FieldErrorKind = 'required' | 'gibberish' | 'other';

function questionHasOtherSelected(
  question: QuizQuestion,
  answer: string | number | string[] | null | undefined,
): boolean {
  if (question.type === 'single-select' && typeof answer === 'string') {
    return isOtherOption(answer);
  }
  if (question.type === 'multi-select' && Array.isArray(answer)) {
    return answer.some((item) => isOtherOption(item));
  }
  return false;
}

function getOtherSpecifyQuestion(question: QuizQuestion): QuizQuestion {
  return {
    id: otherSpecifyKey(question.id),
    question: 'Tell us which one',
    type: 'text',
    placeholder: 'A few words is enough',
    required: true,
  };
}

function getFieldValidationError(
  question: QuizQuestion,
  answer: string | number | string[] | null | undefined,
  hasInteracted: boolean,
  allAnswers?: QuizAnswers,
): FieldErrorKind | null {
  if (isRequiredAnswerMissing(question, answer, hasInteracted)) {
    return 'required';
  }

  if (questionHasOtherSelected(question, answer)) {
    const specifyQuestion = getOtherSpecifyQuestion(question);
    const specifyAnswer = allAnswers?.[otherSpecifyKey(question.id)];
    if (isRequiredAnswerMissing(specifyQuestion, specifyAnswer, true)) {
      return 'other';
    }
  }

  if (
    question.type === 'text' &&
    question.required &&
    typeof answer === 'string' &&
    answer.trim().length > 0
  ) {
    const valid =
      question.textValidation === 'place'
        ? isLikelyValidPlaceName(answer)
        : isLikelyValidText(answer);
    if (!valid) {
      return 'gibberish';
    }
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
  const styles = useThemedStyles(createStyles);

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
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();


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
      if (getFieldValidationError(question, value, true, answers) === null) {
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
      const error = getFieldValidationError(
        q,
        answers[q.id],
        !!interactedFields[q.id],
        answers,
      );
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

  const renderOtherSpecifyInput = (question: QuizQuestion) => {
    if (!questionHasOtherSelected(question, answers[question.id])) {
      return null;
    }
    const specifyId = otherSpecifyKey(question.id);
    const specifyQuestion = getOtherSpecifyQuestion(question);
    return (
      <View style={styles.otherSpecifyWrap}>
        <FocusAwareTextInput
          style={styles.textInput}
          value={String(answers[specifyId] ?? '')}
          placeholder={specifyQuestion.placeholder}
          placeholderTextColor={colors.textTertiary}
          onChangeText={(text) => setAnswer(specifyId, text)}
        />
        {fieldErrors[question.id] === 'other' && (
          <Text style={styles.fieldError}>{validationCopy.otherRequired}</Text>
        )}
      </View>
    );
  };

  const renderQuestionInput = (question: QuizQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'multi-select':
        return (
          <View>
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
            {renderOtherSpecifyInput(question)}
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
                    styles.optionPressable,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => setAnswer(question.id, option)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Card
                    style={[
                      styles.optionCard,
                      selected && styles.optionCardSelected,
                    ]}
                  >
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                      {option}
                    </Text>
                  </Card>
                </Pressable>
              );
            })}
            {renderOtherSpecifyInput(question)}
          </View>
        );

      case 'slider':
        return (
          <QuizSlider
            value={typeof value === 'number' ? value : 50}
            minLabel={question.sliderLabels?.min ?? 'Quiet'}
            maxLabel={question.sliderLabels?.max ?? 'Social'}
            onChange={(next) => {
              markInteracted(question.id);
              setAnswers((prev) => ({ ...prev, [question.id]: next }));
              clearErrorIfValid(question, next);
            }}
          />
        );

      case 'number':
        return (
          <FocusAwareTextInput
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
          <FocusAwareTextInput
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
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        {showBack && onBack ? (
          <BackButton onPress={() => onBack(answers)} style={styles.back} />
        ) : null}

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
            <Text style={styles.question}>{question.question}</Text>
            {renderQuestionInput(question)}
            {fieldErrors[question.id] === 'required' && (
              <Text style={styles.fieldError}>This question is required</Text>
            )}
            {fieldErrors[question.id] === 'gibberish' && (
              <Text style={styles.fieldError}>
                {question.textValidation === 'place'
                  ? validationCopy.placeInvalid
                  : "This doesn't look like a valid answer — please check and try again"}
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
        </View>
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  progressCount: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
  },
  progressTrack: {
    height: spacing.xs,
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
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.md,
  },
  fieldError: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
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
    borderWidth: borderWidths.strong,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: touchTarget,
    justifyContent: 'center',
    ...shadows.card,
  },
  chipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  chipPressed: {
    opacity: 0.95,
  },
  chipLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  chipLabelSelected: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.onAccent,
  },
  otherSpecifyWrap: {
    marginTop: spacing.md,
  },
  optionPressable: {
    marginBottom: spacing.sm,
  },
  optionCard: {
    minHeight: controlHeights.lg,
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
    backgroundColor: colors.warmCream,
  },
  optionCardPressed: {
    opacity: 0.95,
  },
  optionLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.onAccent,
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
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  sliderTrackPressable: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: spacing.sm - borderWidths.strong,
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
    top: -(spacing.sm + spacing.xs / 2),
    width: spacing.lg,
    height: spacing.lg,
    marginLeft: -(spacing.sm + spacing.xs),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    borderWidth: borderWidths.strong + borderWidths.hairline,
    borderColor: colors.white,
    ...shadows.card,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    minHeight: controlHeights.md,
    ...shadows.card,
  },
  textInputMultiline: {
    minHeight: controlHeights.lg + spacing.lg,
    textAlignVertical: 'top',
  },
  skipLink: {
    marginTop: spacing.md,
    minHeight: touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipLinkText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: spacing.lg,
  },
});
}


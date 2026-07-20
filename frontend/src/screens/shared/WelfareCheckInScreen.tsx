import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  touchTarget,
  gradients,
  layout,
  lineHeights,
} from '../../constants/theme';
import type { WelfareCheckInQuestion } from '../../data/welfareMock';
import { welfareCheckInIntro } from '../../data/welfareMock';

export interface WelfareCheckInScreenProps {
  hostName: string;
  checkIn: string;
  checkOut: string;
  questions: WelfareCheckInQuestion[];
  isLoading?: boolean;
  errorMessage?: string | null;
  alreadyCompleted?: boolean;
  onSubmit?: (answers: Record<string, boolean>) => void;
  onSosPress?: () => void;
  onBack?: () => void;
}

export default function WelfareCheckInScreen({
  hostName,
  checkIn,
  checkOut,
  questions,
  isLoading = false,
  errorMessage,
  alreadyCompleted = false,
  onSubmit,
  onSosPress,
  onBack,
}: WelfareCheckInScreenProps) {
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />
        <Text style={styles.headerTitle}>Welfare check-in</Text>
        <Text style={styles.headerSubtitle}>
          Stay with {hostName} · {checkIn} – {checkOut}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl * 3 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{welfareCheckInIntro}</Text>

        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {isLoading ? <SkeletonLoader style={styles.loader} /> : null}

        {alreadyCompleted ? (
          <Card padding="lg">
            <Text style={styles.doneTitle}>Check-in complete</Text>
            <Text style={styles.doneBody}>
              Thanks for confirming you are okay. We will follow up if anything needs attention.
            </Text>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} style={styles.questionCard} padding="lg">
              <Text style={styles.questionText}>{question.prompt}</Text>
              <View style={styles.answerRow}>
                {(['yes', 'no'] as const).map((choice) => {
                  const value = choice === 'yes';
                  const selected = answers[question.id] === value;
                  return (
                    <Pressable
                      key={choice}
                      style={({ pressed }) => [
                        styles.answerButton,
                        selected && styles.answerButtonSelected,
                        pressed && styles.answerButtonPressed,
                      ]}
                      onPress={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: value }))
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`${question.prompt} ${choice}`}
                    >
                      <Text
                        style={[
                          styles.answerLabel,
                          selected && styles.answerLabelSelected,
                        ]}
                      >
                        {choice === 'yes' ? 'Yes' : 'No'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          ))
        )}

        {onSosPress ? (
          <Pressable
            style={({ pressed }) => [styles.sosLink, pressed && styles.pressed]}
            onPress={onSosPress}
            accessibilityRole="button"
            accessibilityLabel="Open emergency SOS"
          >
            <Text style={styles.sosLinkText}>Need immediate help? Open SOS</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      {!alreadyCompleted ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <PrimaryButton
            label="Submit check-in"
            onPress={() => onSubmit?.(answers)}
            disabled={!allAnswered || isLoading}
          />
        </View>
      ) : (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <SecondaryButton label="Back to bookings" onPress={onBack} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
  },
  body: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  bodyContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  intro: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  doneTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  doneBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  questionCard: {
    marginBottom: spacing.md,
  },
  questionText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: lineHeights.body,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerButton: {
    flex: 1,
    minHeight: controlHeights.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  answerButtonSelected: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
    backgroundColor: colors.warmCream,
  },
  answerButtonPressed: {
    opacity: 0.9,
  },
  answerLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    fontWeight: fontWeights.semibold,
  },
  answerLabelSelected: {
    color: colors.tealDeep,
  },
  sosLink: {
    minHeight: touchTarget,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  sosLinkText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.danger,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
});

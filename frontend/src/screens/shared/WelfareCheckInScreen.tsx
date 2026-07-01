import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
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
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
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

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}

        {alreadyCompleted ? (
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>Check-in complete</Text>
            <Text style={styles.doneBody}>
              Thanks for confirming you are okay. We will follow up if anything needs attention.
            </Text>
          </View>
        ) : (
          questions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
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
            </View>
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
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
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
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSizes.body,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  doneCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doneTitle: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  doneBody: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  answerButtonSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  answerButtonPressed: {
    opacity: 0.9,
  },
  answerLabel: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    fontWeight: fontWeights.semibold,
  },
  answerLabelSelected: {
    color: colors.tealDeep,
  },
  sosLink: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  sosLinkText: {
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
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

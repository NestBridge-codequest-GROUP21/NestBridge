import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface ProfileSetupScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  displayName: string;
  bio: string;
  initials: string;
  onDisplayNameChange?: (value: string) => void;
  onBioChange?: (value: string) => void;
  onAddPhoto?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function ProfileSetupScreen({
  currentStep,
  totalSteps,
  title,
  subtitle,
  displayName,
  bio,
  initials,
  onDisplayNameChange,
  onBioChange,
  onAddPhoto,
  onContinue,
  onSkip,
  onBack,
}: ProfileSetupScreenProps) {
  const insets = useSafeAreaInsets();

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
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        )}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabel="Your profile"
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable style={styles.avatarSection} onPress={onAddPhoto}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || '?'}</Text>
          </View>
          <Text style={styles.addPhoto}>Add photo</Text>
          <Text style={styles.addPhotoHint}>Optional — helps hosts recognize you</Text>
        </Pressable>

        <View style={styles.formCard}>
          <FormTextField
            label="Display name"
            value={displayName}
            placeholder="How hosts will see you"
            onChangeText={onDisplayNameChange}
            autoCapitalize="words"
          />
          <FormTextField
            label="Short bio"
            value={bio}
            placeholder="Exchange student, loves cooking & history..."
            onChangeText={onBioChange}
          />
        </View>

        <PrimaryButton label="Continue" onPress={onContinue} />
        <View style={styles.skipSpacer} />
        <SecondaryButton label="Skip for now" onPress={onSkip} />
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
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: 44,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  addPhoto: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  addPhotoHint: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipSpacer: {
    height: spacing.sm,
  },
});

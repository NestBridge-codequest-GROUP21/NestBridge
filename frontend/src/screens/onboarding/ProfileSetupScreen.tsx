import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  shadows,
  touchTarget,
} from '../../constants/theme';

const AVATAR_SIZE = spacing.xl * 3;

export interface ProfileSetupScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  displayName: string;
  bio: string;
  initials: string;
  photoUri?: string | null;
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
  photoUri,
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
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabel="Your profile"
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable
          style={styles.avatarSection}
          onPress={onAddPhoto}
          accessibilityRole="button"
          accessibilityLabel={photoUri ? 'Change photo' : 'Add photo'}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || '?'}</Text>
            </View>
          )}
          <Text style={styles.addPhoto}>{photoUri ? 'Change photo' : 'Add photo'}</Text>
          <Text style={styles.addPhotoHint}>
            Optional — helps hosts and guides recognize you in Ghana
          </Text>
        </Pressable>

        <Card style={styles.formCard}>
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
            placeholder="Exchange student in Accra — love cooking and history"
            onChangeText={onBioChange}
          />
        </Card>

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
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  back: {
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.display,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: touchTarget,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: borderWidths.strong + borderWidths.hairline,
    borderColor: colors.white,
    ...shadows.raised,
  },
  avatarText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  addPhoto: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  addPhotoHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  skipSpacer: {
    height: spacing.sm,
  },
});

import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import ScreenScroll from '../../components/ScreenScroll';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  touchTarget,
  avatarSizes,
} from '../../constants/theme';
import { MIN_ABOUT_LENGTH, MIN_BIO_LENGTH } from '../../utils/accountProfile';
import { bookingGateCopy } from '../../data/appCopy';

const AVATAR_SIZE = avatarSizes.xl + spacing.lg;

export interface ProfileSetupScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  displayName: string;
  bio: string;
  about: string;
  initials: string;
  photoUri?: string | null;
  /** Once bio + about are locked, fields are read-only. */
  identityLocked?: boolean;
  onDisplayNameChange?: (value: string) => void;
  onBioChange?: (value: string) => void;
  onAboutChange?: (value: string) => void;
  onAddPhoto?: () => void;
  onContinue?: () => void;
  /** Soft skip — browse the app; booking will ask to finish bio later. */
  onSkipForNow?: () => void;
  onBack?: () => void;
}

export default function ProfileSetupScreen({
  currentStep,
  totalSteps,
  title,
  subtitle,
  displayName,
  bio,
  about,
  initials,
  photoUri,
  identityLocked = false,
  onDisplayNameChange,
  onBioChange,
  onAboutChange,
  onAddPhoto,
  onContinue,
  onSkipForNow,
  onBack,
}: ProfileSetupScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { scheme } = useTheme();

  const insets = useSafeAreaInsets();

  const canContinue = useMemo(() => {
    if (identityLocked) {
      return true;
    }
    const nameOk = displayName.trim().length >= 2;
    const bioOk = bio.trim().length >= MIN_BIO_LENGTH;
    const aboutOk = about.trim().length >= MIN_ABOUT_LENGTH;
    return nameOk && bioOk && aboutOk;
  }, [about, bio, displayName, identityLocked]);

  const bioHelper = identityLocked
    ? 'Locked in — this is how others recognize you.'
    : `At least ${MIN_BIO_LENGTH} characters to unlock booking. Photo is optional.`;
  const aboutHelper = identityLocked
    ? 'Locked in — guests and hosts read this before they book or message you.'
    : `At least ${MIN_ABOUT_LENGTH} characters to unlock booking. You can skip and browse first.`;

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <ScreenScroll
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabel="Your profile"
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {identityLocked ? (
          <Text style={styles.lockBanner}>{bookingGateCopy.identity}</Text>
        ) : null}

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
            Optional — you can skip the photo and still continue
          </Text>
        </Pressable>

        <Card style={styles.formCard}>
          <FormTextField
            label="Display name"
            value={displayName}
            placeholder="How hosts will see you"
            onChangeText={identityLocked ? undefined : onDisplayNameChange}
            editable={!identityLocked}
            autoCapitalize="words"
            helperText={
              identityLocked
                ? 'Locked with your bio and about.'
                : undefined
            }
          />
          <FormTextField
            label="Short bio"
            value={bio}
            placeholder="Exchange student in Accra — love cooking and history"
            onChangeText={identityLocked ? undefined : onBioChange}
            editable={!identityLocked}
            helperText={bioHelper}
          />
          <FormTextField
            label="About you"
            value={about}
            placeholder="Share who you are, what brings you here, and what others should know before meeting you."
            onChangeText={identityLocked ? undefined : onAboutChange}
            editable={!identityLocked}
            multiline
            numberOfLines={5}
            helperText={aboutHelper}
          />
        </Card>

        <PrimaryButton
          label={identityLocked ? 'Continue' : 'Save and lock profile'}
          onPress={onContinue}
          disabled={!canContinue}
        />
        {!identityLocked && onSkipForNow ? (
          <SecondaryButton
            label="Skip for now — browse first"
            onPress={onSkipForNow}
            style={styles.skipButton}
          />
        ) : null}
        {!identityLocked ? (
          <Text style={styles.lockHint}>
            Photo is optional. You can browse NestBridge without finishing bio
            yet — when you book, message, or accept a request, we will send you
            back here to complete your profile.
          </Text>
        ) : null}
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
    lockBanner: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
      backgroundColor: colors.warmCream,
      borderRadius: borderRadius.md,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.lg,
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
      color: colors.onPrimary,
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
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs,
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
    },
    formCard: {
      marginBottom: spacing.lg,
    },
    skipButton: {
      marginTop: spacing.sm,
    },
    lockHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
  });
}

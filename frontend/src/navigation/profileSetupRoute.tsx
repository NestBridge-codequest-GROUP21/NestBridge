import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import {
  ONBOARDING_TOTAL_STEPS,
  profileSetupMock,
} from '../data/studentOnboardingMock';
import { pickProfileImage } from '../services/imagePicker';
import { getApiErrorMessage } from '../services/api';
import { uploadProfilePhotoIfConfigured } from '../services/mediaUpload';
import type { SetupTrack } from '../types/accountProfile';
import {
  getProgressForTrack,
  isIdentityLocked,
  MIN_ABOUT_LENGTH,
  MIN_BIO_LENGTH,
} from '../utils/accountProfile';
import { appAlert } from '../utils/appAlert';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export interface ProfileSetupRouteProps {
  track: SetupTrack;
  onFinished: () => void;
  onBack: () => void;
}

/**
 * Owns bio/about form state locally so typing does not re-render AppNavigator.
 */
export function ProfileSetupRoute({
  track,
  onFinished,
  onBack,
}: ProfileSetupRouteProps) {
  const { user } = useAuth();
  const { state: profileState, completeStep } = useAccountProfile();
  const progress = useMemo(
    () => getProgressForTrack(profileState, track),
    [profileState, track],
  );
  const locked = isIdentityLocked(progress);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [about, setAbout] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    setDisplayName(
      progress.data.displayName?.trim() || user?.displayName?.trim() || '',
    );
    setBio(progress.data.bio ?? '');
    setAbout(progress.data.about ?? '');
    setPhotoUri(progress.data.profilePhotoUrl ?? null);
    setHydrated(true);
  }, [hydrated, progress.data, user?.displayName]);

  const handleAddPhoto = useCallback(async () => {
    if (locked || submitting) return;
    const picked = await pickProfileImage();
    if (picked?.uri) {
      setPhotoUri(picked.uri);
    }
  }, [locked, submitting]);

  const saveProfile = useCallback(
    async (options?: { skipIdentity?: boolean }) => {
      if (submitting) return false;

      if (locked) {
        setSubmitting(true);
        try {
          await completeStep(track, 'profile', {
            displayName: progress.data.displayName,
            bio: progress.data.bio,
            about: progress.data.about,
            identityLocked: true,
          });
          return true;
        } catch (error) {
          appAlert('Could not save profile', getApiErrorMessage(error));
          return false;
        } finally {
          setSubmitting(false);
        }
      }

      const profileName = displayName.trim() || user?.displayName?.trim() || '';
      const nextBio = bio.trim();
      const nextAbout = about.trim();

      if (options?.skipIdentity) {
        setSubmitting(true);
        try {
          const stepData: Record<string, string | boolean> = {
            identityLocked: false,
          };
          if (profileName.length >= 2) {
            stepData.displayName = profileName;
          }
          if (nextBio) {
            stepData.bio = nextBio;
          }
          if (nextAbout) {
            stepData.about = nextAbout;
          }
          await completeStep(track, 'profile', stepData);
          return true;
        } catch (error) {
          appAlert('Could not save profile', getApiErrorMessage(error));
          return false;
        } finally {
          setSubmitting(false);
        }
      }

      if (profileName.length < 2) {
        appAlert('Display name needed', 'Enter a display name with at least 2 characters.');
        return false;
      }
      if (nextBio.length < MIN_BIO_LENGTH) {
        appAlert(
          'Bio too short',
          `Write at least ${MIN_BIO_LENGTH} characters in your short bio.`,
        );
        return false;
      }
      if (nextAbout.length < MIN_ABOUT_LENGTH) {
        appAlert(
          'About section too short',
          `Write at least ${MIN_ABOUT_LENGTH} characters in About you.`,
        );
        return false;
      }

      setSubmitting(true);
      try {
        let profilePhotoUrl: string | undefined;
        try {
          profilePhotoUrl = await uploadProfilePhotoIfConfigured(photoUri);
        } catch {
          profilePhotoUrl = undefined;
        }
        const stepData: Record<string, string | boolean> = {
          displayName: profileName,
          bio: nextBio,
          about: nextAbout,
          identityLocked: true,
        };
        if (profilePhotoUrl) {
          stepData.profilePhotoUrl = profilePhotoUrl;
        }
        await completeStep(track, 'profile', stepData);
        return true;
      } catch (error) {
        appAlert('Could not save profile', getApiErrorMessage(error));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [
      about,
      bio,
      completeStep,
      displayName,
      locked,
      photoUri,
      progress.data.about,
      progress.data.bio,
      progress.data.displayName,
      submitting,
      track,
      user?.displayName,
    ],
  );

  return (
    <ProfileSetupScreen
      currentStep={3}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      {...profileSetupMock}
      displayName={displayName}
      bio={bio}
      about={about}
      initials={initialsFromName(displayName || user?.displayName || '')}
      photoUri={photoUri}
      identityLocked={locked}
      submitting={submitting}
      onAddPhoto={() => {
        void handleAddPhoto();
      }}
      onDisplayNameChange={setDisplayName}
      onBioChange={setBio}
      onAboutChange={setAbout}
      onContinue={() => {
        void (async () => {
          const ok = await saveProfile();
          if (ok) {
            onFinished();
          }
        })();
      }}
      onSkipForNow={() => {
        void (async () => {
          const ok = await saveProfile({ skipIdentity: true });
          if (ok) {
            onFinished();
          }
        })();
      }}
      onBack={onBack}
    />
  );
}

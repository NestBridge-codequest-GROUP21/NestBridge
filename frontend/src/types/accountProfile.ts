import type { QuizAnswers } from '../screens/onboarding/QuizPage';

export type PrimaryIntent = 'STUDENT' | 'TOURIST' | 'HOST' | 'GUIDE';

export type SetupTrack = 'SEEKER' | 'HOST' | 'GUIDE';

export type ProfileStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';

export interface ProfileData {
  city?: string;
  university?: string;
  arrivalDate?: string;
  departureDate?: string;
  displayName?: string;
  bio?: string;
  quizAnswers?: QuizAnswers;
  checklistCompleted?: string[];
}

export interface ProfileProgress {
  status: ProfileStatus;
  stepsCompleted: string[];
  data: ProfileData;
}

export interface AccountProfileState {
  primaryIntent: PrimaryIntent | null;
  /** Default true for Student-intent accounts; ignored for other intents. */
  isActiveExchangeStudent?: boolean;
  seekerSetup: ProfileProgress;
  hostProvider: ProfileProgress;
  guideProvider: ProfileProgress;
}

export const SEEKER_STEPS = ['destination', 'quiz', 'profile', 'ready'] as const;
export const HOST_PROVIDER_STEPS = ['quiz', 'profile', 'ready'] as const;
export const GUIDE_PROVIDER_STEPS = ['quiz', 'profile', 'ready'] as const;

export const PRIMARY_INTENT_LABELS: Record<PrimaryIntent, string> = {
  STUDENT: 'Student / Traveler',
  TOURIST: 'Tourist',
  HOST: 'Host family',
  GUIDE: 'Cultural guide',
};

export const PRIMARY_INTENT_ICONS: Record<PrimaryIntent, string> = {
  STUDENT: '🎓',
  TOURIST: '✈️',
  HOST: '🏠',
  GUIDE: '🗺️',
};

export const PRIMARY_INTENT_DESCRIPTIONS: Record<PrimaryIntent, string> = {
  STUDENT: 'Find host families and book homestays near campus',
  TOURIST: 'Explore sites, book guides, and find lodging',
  HOST: 'Open your home and accept homestay requests',
  GUIDE: 'Offer tours and accept session bookings',
};

export const SETUP_TRACK_LABELS: Record<SetupTrack, string> = {
  SEEKER: 'Travel profile',
  HOST: 'Host listing',
  GUIDE: 'Guide listing',
};

export const SETUP_TRACK_DESCRIPTIONS: Record<SetupTrack, string> = {
  SEEKER: 'Book homestays and guide sessions anywhere you travel',
  HOST: 'Accept homestay requests from students',
  GUIDE: 'Accept tour and session bookings',
};

export const SETUP_TRACK_ICONS: Record<SetupTrack, string> = {
  SEEKER: '🧳',
  HOST: '🏠',
  GUIDE: '🗺️',
};

export const PROVIDER_BLOCKED_MESSAGE =
  'Active exchange students can book stays and guides, but cannot list as a host or guide until they mark themselves as no longer on exchange.';

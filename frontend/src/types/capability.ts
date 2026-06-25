import type { QuizAnswers } from '../screens/onboarding/QuizPage';

export type Capability =
  | 'STUDENT_SEEKER'
  | 'TOURIST_SEEKER'
  | 'HOST'
  | 'GUIDE';

export type CapabilityStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';

export interface CapabilityProfileData {
  city?: string;
  university?: string;
  arrivalDate?: string;
  departureDate?: string;
  displayName?: string;
  bio?: string;
  quizAnswers?: QuizAnswers;
}

export interface CapabilityProgress {
  capability: Capability;
  status: CapabilityStatus;
  stepsCompleted: string[];
  data: CapabilityProfileData;
}

export interface CapabilitiesState {
  activeCapability: Capability | null;
  capabilities: Record<Capability, CapabilityProgress>;
}

export const CAPABILITY_STEPS: Record<Capability, string[]> = {
  STUDENT_SEEKER: ['destination', 'quiz', 'profile', 'ready'],
  TOURIST_SEEKER: ['destination', 'quiz', 'profile', 'ready'],
  HOST: ['quiz', 'profile', 'ready'],
  GUIDE: ['quiz', 'profile', 'ready'],
};

export const CAPABILITY_LABELS: Record<Capability, string> = {
  STUDENT_SEEKER: 'Student / Traveler',
  TOURIST_SEEKER: 'Tourist',
  HOST: 'Host family',
  GUIDE: 'Cultural guide',
};

export const CAPABILITY_DESCRIPTIONS: Record<Capability, string> = {
  STUDENT_SEEKER: 'Find host families and book homestays near campus',
  TOURIST_SEEKER: 'Explore sites, book guides, and find lodging',
  HOST: 'Open your home and accept homestay requests',
  GUIDE: 'Offer tours and accept session bookings',
};

export const CAPABILITY_ICONS: Record<Capability, string> = {
  STUDENT_SEEKER: '🎓',
  TOURIST_SEEKER: '✈️',
  HOST: '🏠',
  GUIDE: '🗺️',
};

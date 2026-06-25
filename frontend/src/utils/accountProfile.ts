import type { BookingContext } from '../types/booking';
import type {
  AccountProfileState,
  PrimaryIntent,
  ProfileProgress,
  SetupTrack,
} from '../types/accountProfile';
import {
  GUIDE_PROVIDER_STEPS,
  HOST_PROVIDER_STEPS,
  HOST_PROVIDER_BLOCKED_MESSAGE,
  SEEKER_STEPS,
} from '../types/accountProfile';

function createEmptyProgress(): ProfileProgress {
  return {
    status: 'NOT_STARTED',
    stepsCompleted: [],
    data: {},
  };
}

export function createDefaultAccountProfileState(): AccountProfileState {
  return {
    primaryIntent: null,
    seekerSetup: createEmptyProgress(),
    hostProvider: createEmptyProgress(),
    guideProvider: createEmptyProgress(),
  };
}

export function isProfileComplete(progress: ProfileProgress): boolean {
  return progress.status === 'COMPLETE';
}

export function isSeekerComplete(state: AccountProfileState): boolean {
  return isProfileComplete(state.seekerSetup);
}

export function isHostComplete(state: AccountProfileState): boolean {
  return isProfileComplete(state.hostProvider);
}

export function isGuideComplete(state: AccountProfileState): boolean {
  return isProfileComplete(state.guideProvider);
}

export function canBookHomestay(state: AccountProfileState): boolean {
  return isSeekerComplete(state);
}

export function canBookGuideSession(state: AccountProfileState): boolean {
  return isSeekerComplete(state);
}

export function canAcceptHostBookings(state: AccountProfileState): boolean {
  return isHostComplete(state) && canEnableHostProvider(state);
}

export function canAcceptGuideSessions(state: AccountProfileState): boolean {
  return isGuideComplete(state);
}

export function canEnableHostProvider(state: AccountProfileState): boolean {
  return state.primaryIntent !== 'STUDENT';
}

export function getHostProviderBlockedReason(
  state: AccountProfileState,
): string | null {
  if (canEnableHostProvider(state)) {
    return null;
  }
  return HOST_PROVIDER_BLOCKED_MESSAGE;
}

export function getProgressPercent(
  progress: ProfileProgress,
  steps: readonly string[],
): number {
  if (progress.status === 'COMPLETE') {
    return 100;
  }
  if (steps.length === 0) {
    return 0;
  }
  return Math.round((progress.stepsCompleted.length / steps.length) * 100);
}

export function getNextStep(
  progress: ProfileProgress,
  steps: readonly string[],
): string | null {
  return steps.find((step) => !progress.stepsCompleted.includes(step)) ?? null;
}

export function getSeekerNextStep(state: AccountProfileState): string | null {
  if (state.primaryIntent === 'HOST' || state.primaryIntent === 'GUIDE') {
    const withoutDestination = SEEKER_STEPS.filter((s) => s !== 'destination');
    return getNextStep(state.seekerSetup, withoutDestination);
  }
  return getNextStep(state.seekerSetup, SEEKER_STEPS);
}

export function getHostNextStep(state: AccountProfileState): string | null {
  return getNextStep(state.hostProvider, HOST_PROVIDER_STEPS);
}

export function getGuideNextStep(state: AccountProfileState): string | null {
  return getNextStep(state.guideProvider, GUIDE_PROVIDER_STEPS);
}

export function seekerUsesDestination(intent: PrimaryIntent | null): boolean {
  return intent === 'STUDENT' || intent === 'TOURIST';
}

export function getSeekerQuizRoute(
  intent: PrimaryIntent | null,
): 'StudentQuiz' | 'TouristQuiz' {
  if (intent === 'STUDENT') {
    return 'StudentQuiz';
  }
  return 'TouristQuiz';
}

export function getProviderQuizRoute(
  track: 'HOST' | 'GUIDE',
): 'HostQuiz' | 'GuideQuiz' {
  return track === 'HOST' ? 'HostQuiz' : 'GuideQuiz';
}

export type HomeRoute =
  | 'IntentSelect'
  | 'BrowseHome'
  | 'StudentHome'
  | 'ExploreHome'
  | 'HostHome'
  | 'GuideHome';

export function getHomeRoute(state: AccountProfileState): HomeRoute {
  if (!state.primaryIntent) {
    return 'IntentSelect';
  }
  switch (state.primaryIntent) {
    case 'STUDENT':
      return 'StudentHome';
    case 'TOURIST':
      return 'ExploreHome';
    case 'HOST':
      return 'HostHome';
    case 'GUIDE':
      return 'GuideHome';
    default:
      return 'BrowseHome';
  }
}

export function getBookingContext(
  state: AccountProfileState,
  bookingType: 'HOST' | 'GUIDE',
): BookingContext {
  const intent = state.primaryIntent;
  if (intent === 'STUDENT' && bookingType === 'HOST') {
    return 'STUDENT';
  }
  if (intent === 'TOURIST' && bookingType === 'GUIDE') {
    return 'TOURIST';
  }
  if (intent === 'HOST' || intent === 'GUIDE') {
    return 'TRAVEL';
  }
  if (bookingType === 'HOST') {
    return intent === 'TOURIST' ? 'TRAVEL' : 'STUDENT';
  }
  return intent === 'STUDENT' ? 'STUDENT' : 'TOURIST';
}

export function getAccountSetupSummary(state: AccountProfileState): string {
  const parts: string[] = [];
  parts.push(
    isSeekerComplete(state) ? 'Ready to book stays' : 'Add travel details to book',
  );
  if (state.primaryIntent !== 'STUDENT') {
    parts.push(
      isHostComplete(state) ? 'Host listing live' : 'Host listing not added',
    );
  }
  parts.push(
    isGuideComplete(state) ? 'Guide listing live' : 'Guide listing not added',
  );
  return parts.join(' · ');
}

export function countCompletedSetups(state: AccountProfileState): number {
  let count = 0;
  if (isSeekerComplete(state)) {
    count += 1;
  }
  if (isHostComplete(state)) {
    count += 1;
  }
  if (isGuideComplete(state)) {
    count += 1;
  }
  return count;
}

export function getStepsForTrack(
  track: SetupTrack,
  primaryIntent: PrimaryIntent | null,
): readonly string[] {
  if (track === 'SEEKER') {
    if (primaryIntent === 'HOST' || primaryIntent === 'GUIDE') {
      return SEEKER_STEPS.filter((s) => s !== 'destination');
    }
    return SEEKER_STEPS;
  }
  if (track === 'HOST') {
    return HOST_PROVIDER_STEPS;
  }
  return GUIDE_PROVIDER_STEPS;
}

export function getProgressForTrack(
  state: AccountProfileState,
  track: SetupTrack,
): ProfileProgress {
  if (track === 'SEEKER') {
    return state.seekerSetup;
  }
  if (track === 'HOST') {
    return state.hostProvider;
  }
  return state.guideProvider;
}

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
  PROVIDER_BLOCKED_MESSAGE,
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

/** Higher = more onboarding progress (used when merging local vs remote). */
export function profileCompletenessScore(state: AccountProfileState): number {
  let score = 0;
  if (state.primaryIntent) {
    score += 20;
  }
  const tracks = [state.seekerSetup, state.hostProvider, state.guideProvider];
  for (const track of tracks) {
    score += track.stepsCompleted.length * 3;
    if (track.status === 'IN_PROGRESS') {
      score += 2;
    }
    if (track.status === 'COMPLETE') {
      score += 10;
    }
    score += Object.keys(track.data ?? {}).length;
  }
  return score;
}

/**
 * Prefer the richer of local SecureStore vs remote API profile so a failed
 * remote sync cannot wipe completed onboarding on the next cold start.
 */
export function preferRicherAccountProfile(
  local: AccountProfileState | null | undefined,
  remote: AccountProfileState | null | undefined,
): AccountProfileState {
  if (!local && !remote) {
    return createDefaultAccountProfileState();
  }
  if (!local) {
    return remote!;
  }
  if (!remote) {
    return local;
  }
  return profileCompletenessScore(local) > profileCompletenessScore(remote)
    ? local
    : remote;
}

/**
 * Strip host/guide payloads for active exchange students so PUT /profile
 * never trips the server-side provider block when syncing seeker progress.
 */
export function sanitizeProfileForRemoteSync(
  state: AccountProfileState,
): AccountProfileState {
  if (!isActiveExchangeStudent(state)) {
    return state;
  }
  return {
    ...state,
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
  return isGuideComplete(state) && canEnableGuideProvider(state);
}

export function isActiveExchangeStudent(state: AccountProfileState): boolean {
  return (
    state.primaryIntent === 'STUDENT' &&
    (state.isActiveExchangeStudent ?? true)
  );
}

export function canEnableHostProvider(state: AccountProfileState): boolean {
  return !isActiveExchangeStudent(state);
}

export function canEnableGuideProvider(state: AccountProfileState): boolean {
  return !isActiveExchangeStudent(state);
}

export function getProviderBlockedReason(
  state: AccountProfileState,
): string | null {
  if (canEnableHostProvider(state)) {
    return null;
  }
  return PROVIDER_BLOCKED_MESSAGE;
}

/** @deprecated Use getProviderBlockedReason */
export function getHostProviderBlockedReason(
  state: AccountProfileState,
): string | null {
  return getProviderBlockedReason(state);
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
  | 'GuideHome'
  | 'AdminHome';

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

/**
 * Staff land on the ops shell unless they deliberately entered app preview.
 * Preview uses a local role override and does not change the staff account intent.
 */
export function getStaffAwareHomeRoute(
  isStaff: boolean,
  previewRole: PrimaryIntent | null | undefined,
  state: AccountProfileState,
): HomeRoute {
  if (isStaff && !previewRole) {
    return 'AdminHome';
  }
  if (isStaff && previewRole) {
    return getHomeRoute({ ...state, primaryIntent: previewRole });
  }
  return getHomeRoute(state);
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
  if (isActiveExchangeStudent(state)) {
    parts.push('Host & guide listing locked');
  } else {
    parts.push(
      isHostComplete(state) ? 'Host listing live' : 'Host listing not added',
    );
    parts.push(
      isGuideComplete(state) ? 'Guide listing live' : 'Guide listing not added',
    );
  }
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

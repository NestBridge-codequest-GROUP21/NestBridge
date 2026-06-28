import type {
  AccountProfileState,
  PrimaryIntent,
  ProfileProgress,
  SetupTrack,
} from '../types/accountProfile';
import {
  GUIDE_PROVIDER_STEPS,
  HOST_PROVIDER_STEPS,
  SEEKER_STEPS,
} from '../types/accountProfile';
import { createDefaultAccountProfileState } from './accountProfile';

function emptyProgress(): ProfileProgress {
  return { status: 'NOT_STARTED', stepsCompleted: [], data: {} };
}

function completeProgress(steps: readonly string[]): ProfileProgress {
  return { status: 'COMPLETE', stepsCompleted: [...steps], data: {} };
}

function partialProgress(steps: readonly string[]): ProfileProgress {
  if (steps.length === 0) {
    return emptyProgress();
  }
  return {
    status: 'IN_PROGRESS',
    stepsCompleted: [...steps],
    data: {},
  };
}

function seekerStepsForIntent(intent: PrimaryIntent): readonly string[] {
  if (intent === 'HOST' || intent === 'GUIDE') {
    return SEEKER_STEPS.filter((step) => step !== 'destination');
  }
  return SEEKER_STEPS;
}

export function presetNewUser(): AccountProfileState {
  return createDefaultAccountProfileState();
}

export function presetNoIntent(): AccountProfileState {
  return createDefaultAccountProfileState();
}

export function presetHomeDashboard(intent: PrimaryIntent): AccountProfileState {
  const seekerSteps = seekerStepsForIntent(intent);
  return {
    primaryIntent: intent,
    isActiveExchangeStudent: intent === 'STUDENT' ? true : undefined,
    seekerSetup: completeProgress(seekerSteps),
    hostProvider:
      intent === 'HOST' ? completeProgress(HOST_PROVIDER_STEPS) : emptyProgress(),
    guideProvider:
      intent === 'GUIDE' ? completeProgress(GUIDE_PROVIDER_STEPS) : emptyProgress(),
  };
}

export function presetPartialOnboarding(
  intent: PrimaryIntent,
  track: SetupTrack,
): AccountProfileState {
  const seekerSteps = seekerStepsForIntent(intent);
  const state: AccountProfileState = {
    primaryIntent: intent,
    isActiveExchangeStudent: intent === 'STUDENT' ? true : undefined,
    seekerSetup: emptyProgress(),
    hostProvider: emptyProgress(),
    guideProvider: emptyProgress(),
  };

  if (track === 'SEEKER') {
    return {
      ...state,
      seekerSetup: partialProgress([seekerSteps[0] ?? 'destination']),
    };
  }
  if (track === 'HOST') {
    return {
      ...state,
      seekerSetup: completeProgress(seekerSteps),
      hostProvider: partialProgress(['quiz']),
    };
  }
  return {
    ...state,
    seekerSetup: completeProgress(seekerSteps),
    guideProvider: partialProgress(['quiz']),
  };
}

export function presetExchangeStudentFlag(active: boolean): AccountProfileState {
  return {
    ...presetHomeDashboard('STUDENT'),
    isActiveExchangeStudent: active,
  };
}

export type DevHomeRoute =
  | 'IntentSelect'
  | 'StudentHome'
  | 'ExploreHome'
  | 'HostHome'
  | 'GuideHome';

export function homeRouteForIntent(intent: PrimaryIntent | null): DevHomeRoute {
  switch (intent) {
    case 'STUDENT':
      return 'StudentHome';
    case 'TOURIST':
      return 'ExploreHome';
    case 'HOST':
      return 'HostHome';
    case 'GUIDE':
      return 'GuideHome';
    default:
      return 'IntentSelect';
  }
}

export const DEV_HOME_PRESETS: { label: string; intent: PrimaryIntent | null }[] = [
  { label: 'New user (no intent)', intent: null },
  { label: 'Student Home', intent: 'STUDENT' },
  { label: 'Explore Home (Tourist)', intent: 'TOURIST' },
  { label: 'Host Home', intent: 'HOST' },
  { label: 'Guide Home', intent: 'GUIDE' },
];

export const DEV_PARTIAL_PRESETS: {
  label: string;
  intent: PrimaryIntent;
  track: SetupTrack;
}[] = [
  { label: 'Student — seeker mid-flow', intent: 'STUDENT', track: 'SEEKER' },
  { label: 'Tourist — seeker mid-flow', intent: 'TOURIST', track: 'SEEKER' },
  { label: 'Host — host listing mid-flow', intent: 'HOST', track: 'HOST' },
  { label: 'Guide — guide listing mid-flow', intent: 'GUIDE', track: 'GUIDE' },
];

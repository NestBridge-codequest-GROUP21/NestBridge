import type { Capability, CapabilitiesState, CapabilityProgress } from '../types/capability';
import { CAPABILITY_STEPS } from '../types/capability';

const ALL_CAPABILITIES: Capability[] = [
  'STUDENT_SEEKER',
  'TOURIST_SEEKER',
  'HOST',
  'GUIDE',
];

function createEmptyProgress(capability: Capability): CapabilityProgress {
  return {
    capability,
    status: 'NOT_STARTED',
    stepsCompleted: [],
    data: {},
  };
}

export function createDefaultCapabilitiesState(): CapabilitiesState {
  return {
    activeCapability: null,
    capabilities: {
      STUDENT_SEEKER: createEmptyProgress('STUDENT_SEEKER'),
      TOURIST_SEEKER: createEmptyProgress('TOURIST_SEEKER'),
      HOST: createEmptyProgress('HOST'),
      GUIDE: createEmptyProgress('GUIDE'),
    },
  };
}

export function isCapabilityComplete(
  state: CapabilitiesState,
  capability: Capability,
): boolean {
  return state.capabilities[capability].status === 'COMPLETE';
}

export function canBookHomestay(state: CapabilitiesState): boolean {
  return (
    isCapabilityComplete(state, 'STUDENT_SEEKER') ||
    isCapabilityComplete(state, 'TOURIST_SEEKER')
  );
}

export function canBookGuideSession(state: CapabilitiesState): boolean {
  return canBookHomestay(state);
}

export function canAcceptHostBookings(state: CapabilitiesState): boolean {
  return isCapabilityComplete(state, 'HOST');
}

export function canAcceptGuideSessions(state: CapabilitiesState): boolean {
  return isCapabilityComplete(state, 'GUIDE');
}

export function getSeekerRoleFromState(
  state: CapabilitiesState,
): 'STUDENT' | 'TOURIST' {
  if (state.activeCapability === 'TOURIST_SEEKER') {
    return 'TOURIST';
  }
  if (state.activeCapability === 'STUDENT_SEEKER') {
    return 'STUDENT';
  }
  if (isCapabilityComplete(state, 'TOURIST_SEEKER')) {
    return 'TOURIST';
  }
  return 'STUDENT';
}

export function getCapabilityProgressPercent(progress: CapabilityProgress): number {
  const steps = CAPABILITY_STEPS[progress.capability];
  if (progress.status === 'COMPLETE') {
    return 100;
  }
  if (steps.length === 0) {
    return 0;
  }
  return Math.round((progress.stepsCompleted.length / steps.length) * 100);
}

export function getNextOnboardingStep(
  progress: CapabilityProgress,
): string | null {
  const steps = CAPABILITY_STEPS[progress.capability];
  return steps.find((step) => !progress.stepsCompleted.includes(step)) ?? null;
}

export function capabilityUsesDestination(capability: Capability): boolean {
  return capability === 'STUDENT_SEEKER' || capability === 'TOURIST_SEEKER';
}

export function getQuizRouteForCapability(
  capability: Capability,
): 'StudentQuiz' | 'HostQuiz' | 'TouristQuiz' | 'GuideQuiz' {
  switch (capability) {
    case 'HOST':
      return 'HostQuiz';
    case 'GUIDE':
      return 'GuideQuiz';
    case 'TOURIST_SEEKER':
      return 'TouristQuiz';
    default:
      return 'StudentQuiz';
  }
}

export function getIncompleteSeekerLabel(state: CapabilitiesState): string {
  if (
    isCapabilityComplete(state, 'STUDENT_SEEKER') ||
    isCapabilityComplete(state, 'TOURIST_SEEKER')
  ) {
    return '';
  }
  return 'Student or Tourist';
}

export function listCompletedCapabilities(state: CapabilitiesState): Capability[] {
  return ALL_CAPABILITIES.filter((cap) => isCapabilityComplete(state, cap));
}

export function getPrimaryIncompleteSeekerCapability(
  state: CapabilitiesState,
): Capability {
  if (!isCapabilityComplete(state, 'STUDENT_SEEKER')) {
    return 'STUDENT_SEEKER';
  }
  if (!isCapabilityComplete(state, 'TOURIST_SEEKER')) {
    return 'TOURIST_SEEKER';
  }
  return 'STUDENT_SEEKER';
}

export function getHomeRoute(
  state: CapabilitiesState,
): 'BrowseHome' | 'StudentHome' | 'ExploreHome' {
  const active = state.activeCapability;
  if (active === 'TOURIST_SEEKER' && isCapabilityComplete(state, 'TOURIST_SEEKER')) {
    return 'ExploreHome';
  }
  if (active === 'STUDENT_SEEKER' && isCapabilityComplete(state, 'STUDENT_SEEKER')) {
    return 'StudentHome';
  }
  if (isCapabilityComplete(state, 'TOURIST_SEEKER') && active === 'TOURIST_SEEKER') {
    return 'ExploreHome';
  }
  return 'BrowseHome';
}

export function countCompletedCapabilities(state: CapabilitiesState): number {
  return listCompletedCapabilities(state).length;
}

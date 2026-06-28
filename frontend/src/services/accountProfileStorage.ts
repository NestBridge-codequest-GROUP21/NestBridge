import * as SecureStore from 'expo-secure-store';
import type { AccountProfileState } from '../types/accountProfile';
import type { CapabilitiesState } from '../types/capability';
import { createDefaultAccountProfileState } from '../utils/accountProfile';

const profileKey = (userId: string) => `nestbridge_account_profile_${userId}`;
const legacyKey = (userId: string) => `nestbridge_capabilities_${userId}`;

function normalizeProfileState(state: AccountProfileState): AccountProfileState {
  if (state.primaryIntent === 'STUDENT' && state.isActiveExchangeStudent === undefined) {
    return { ...state, isActiveExchangeStudent: true };
  }
  return state;
}

function mergeSeekerData(
  studentData: CapabilitiesState['capabilities']['STUDENT_SEEKER']['data'],
  touristData: CapabilitiesState['capabilities']['TOURIST_SEEKER']['data'],
): AccountProfileState['seekerSetup']['data'] {
  return { ...touristData, ...studentData };
}

function capabilityToIntent(
  capability: CapabilitiesState['activeCapability'],
  state: CapabilitiesState,
): AccountProfileState['primaryIntent'] {
  if (capability === 'STUDENT_SEEKER') {
    return 'STUDENT';
  }
  if (capability === 'TOURIST_SEEKER') {
    return 'TOURIST';
  }
  if (capability === 'HOST') {
    return 'HOST';
  }
  if (capability === 'GUIDE') {
    return 'GUIDE';
  }
  if (state.capabilities.STUDENT_SEEKER.status === 'COMPLETE') {
    return 'STUDENT';
  }
  if (state.capabilities.TOURIST_SEEKER.status === 'COMPLETE') {
    return 'TOURIST';
  }
  if (state.capabilities.HOST.status === 'COMPLETE') {
    return 'HOST';
  }
  if (state.capabilities.GUIDE.status === 'COMPLETE') {
    return 'GUIDE';
  }
  return null;
}

function migrateFromLegacyCapabilities(
  legacy: CapabilitiesState,
): AccountProfileState {
  const student = legacy.capabilities.STUDENT_SEEKER;
  const tourist = legacy.capabilities.TOURIST_SEEKER;
  const host = legacy.capabilities.HOST;
  const guide = legacy.capabilities.GUIDE;

  const seekerComplete =
    student.status === 'COMPLETE' || tourist.status === 'COMPLETE';
  const seekerSteps = seekerComplete
    ? [...new Set([...student.stepsCompleted, ...tourist.stepsCompleted])]
    : student.stepsCompleted.length > 0
      ? student.stepsCompleted
      : tourist.stepsCompleted;
  const seekerStatus = seekerComplete
    ? 'COMPLETE'
    : seekerSteps.length > 0
      ? 'IN_PROGRESS'
      : 'NOT_STARTED';

  return normalizeProfileState({
    primaryIntent: capabilityToIntent(legacy.activeCapability, legacy),
    isActiveExchangeStudent:
      capabilityToIntent(legacy.activeCapability, legacy) === 'STUDENT'
        ? true
        : undefined,
    seekerSetup: {
      status: seekerStatus as AccountProfileState['seekerSetup']['status'],
      stepsCompleted: seekerSteps,
      data: mergeSeekerData(student.data, tourist.data),
    },
    hostProvider: {
      status: host.status,
      stepsCompleted: host.stepsCompleted,
      data: host.data,
    },
    guideProvider: {
      status: guide.status,
      stepsCompleted: guide.stepsCompleted,
      data: guide.data,
    },
  });
}

export async function loadAccountProfile(
  userId: string,
): Promise<AccountProfileState> {
  const raw = await SecureStore.getItemAsync(profileKey(userId));
  if (raw) {
    try {
      return normalizeProfileState(JSON.parse(raw) as AccountProfileState);
    } catch {
      return createDefaultAccountProfileState();
    }
  }

  const legacyRaw = await SecureStore.getItemAsync(legacyKey(userId));
  if (legacyRaw) {
    try {
      const migrated = migrateFromLegacyCapabilities(
        JSON.parse(legacyRaw) as CapabilitiesState,
      );
      await saveAccountProfile(userId, migrated);
      return migrated;
    } catch {
      return createDefaultAccountProfileState();
    }
  }

  return createDefaultAccountProfileState();
}

export async function saveAccountProfile(
  userId: string,
  state: AccountProfileState,
): Promise<void> {
  await SecureStore.setItemAsync(profileKey(userId), JSON.stringify(state));
}

export async function clearAccountProfile(userId: string): Promise<void> {
  await SecureStore.deleteItemAsync(profileKey(userId));
  await SecureStore.deleteItemAsync(legacyKey(userId));
}

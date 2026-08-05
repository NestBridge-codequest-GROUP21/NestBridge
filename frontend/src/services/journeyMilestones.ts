import * as SecureStore from 'expo-secure-store';
import {
  EMPTY_JOURNEY_MILESTONES,
  type JourneyMilestones,
} from '../types/journeyProgress';

function milestonesKey(userId: string): string {
  return `nestbridge.journeyMilestones.${userId}`;
}

export async function loadJourneyMilestones(
  userId: string,
): Promise<JourneyMilestones> {
  try {
    const raw = await SecureStore.getItemAsync(milestonesKey(userId));
    if (!raw) {
      return { ...EMPTY_JOURNEY_MILESTONES };
    }
    const parsed = JSON.parse(raw) as Partial<JourneyMilestones>;
    return {
      emergencyContactsSaved: Boolean(parsed.emergencyContactsSaved),
      cultureTipsCompleted: Boolean(parsed.cultureTipsCompleted),
      languageBasicsCompleted: Boolean(parsed.languageBasicsCompleted),
    };
  } catch {
    return { ...EMPTY_JOURNEY_MILESTONES };
  }
}

export async function saveJourneyMilestones(
  userId: string,
  milestones: JourneyMilestones,
): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      milestonesKey(userId),
      JSON.stringify(milestones),
    );
  } catch {
    // Best-effort local milestones only.
  }
}

export async function markJourneyMilestone(
  userId: string,
  key: keyof JourneyMilestones,
): Promise<JourneyMilestones> {
  const current = await loadJourneyMilestones(userId);
  if (current[key]) {
    return current;
  }
  const next = { ...current, [key]: true };
  await saveJourneyMilestones(userId, next);
  return next;
}

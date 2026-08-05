import AsyncStorage from '@react-native-async-storage/async-storage';

const FEEDBACK_PREFERENCE_KEY = 'nestbridge_feedback_preferences';

export type FeedbackPreferences = {
  /** Device vibration / haptics for taps and outcomes. */
  hapticsEnabled: boolean;
  /** Short UI chimes (success / error). Speech for language phrases is separate. */
  soundsEnabled: boolean;
};

export const DEFAULT_FEEDBACK_PREFERENCES: FeedbackPreferences = {
  hapticsEnabled: true,
  soundsEnabled: true,
};

let cached: FeedbackPreferences = { ...DEFAULT_FEEDBACK_PREFERENCES };

function normalize(value: unknown): FeedbackPreferences {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_FEEDBACK_PREFERENCES };
  }
  const raw = value as Partial<FeedbackPreferences>;
  return {
    hapticsEnabled: raw.hapticsEnabled !== false,
    soundsEnabled: raw.soundsEnabled !== false,
  };
}

/** Sync read for feedback helpers — hydrated on app start / Settings changes. */
export function getFeedbackPreferences(): FeedbackPreferences {
  return cached;
}

export function setFeedbackPreferencesCache(
  next: FeedbackPreferences,
): void {
  cached = {
    hapticsEnabled: next.hapticsEnabled !== false,
    soundsEnabled: next.soundsEnabled !== false,
  };
}

export async function loadFeedbackPreferences(): Promise<FeedbackPreferences> {
  try {
    const raw = await AsyncStorage.getItem(FEEDBACK_PREFERENCE_KEY);
    if (!raw) {
      cached = { ...DEFAULT_FEEDBACK_PREFERENCES };
      return cached;
    }
    cached = normalize(JSON.parse(raw));
    return cached;
  } catch {
    cached = { ...DEFAULT_FEEDBACK_PREFERENCES };
    return cached;
  }
}

export async function saveFeedbackPreferences(
  next: FeedbackPreferences,
): Promise<FeedbackPreferences> {
  const normalized = normalize(next);
  cached = normalized;
  try {
    await AsyncStorage.setItem(
      FEEDBACK_PREFERENCE_KEY,
      JSON.stringify(normalized),
    );
  } catch {
    // Cache still updated so the session respects the toggle.
  }
  return normalized;
}

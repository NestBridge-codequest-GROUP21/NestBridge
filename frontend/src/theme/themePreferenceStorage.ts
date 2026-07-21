import * as SecureStore from 'expo-secure-store';
import type { ThemePreference } from './palettes';

const THEME_PREFERENCE_KEY = 'nestbridge_theme_preference';

const VALID: ThemePreference[] = [
  'light',
  'dark-teal',
  'dark-warm',
  'dark-bold',
];

/** Migrate earlier light/dark/system values to the four-variant model. */
function migrateLegacyPreference(raw: string): ThemePreference | null {
  if (raw === 'dark') {
    return 'dark-teal';
  }
  if (raw === 'system') {
    return 'light';
  }
  return null;
}

export function isValidThemePreference(
  value: unknown,
): value is ThemePreference {
  return typeof value === 'string' && VALID.includes(value as ThemePreference);
}

/** Default: NestBridge light appearance. Persists via SecureStore. */
export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const raw = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);
    if (!raw) {
      return 'light';
    }
    if (isValidThemePreference(raw)) {
      return raw;
    }
    const migrated = migrateLegacyPreference(raw);
    if (migrated) {
      await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, migrated);
      return migrated;
    }
    return 'light';
  } catch (error) {
    console.warn('[themePreferenceStorage] load failed', error);
    return 'light';
  }
}

export async function saveThemePreference(
  preference: ThemePreference,
): Promise<void> {
  if (!isValidThemePreference(preference)) {
    return;
  }
  try {
    await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, preference);
  } catch (error) {
    console.warn('[themePreferenceStorage] save failed', error);
  }
}

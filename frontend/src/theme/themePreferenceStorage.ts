import * as SecureStore from 'expo-secure-store';
import type { ThemePreference } from './palettes';

const THEME_PREFERENCE_KEY = 'nestbridge_theme_preference';

const VALID: ThemePreference[] = ['light', 'dark', 'system'];

export function isValidThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && VALID.includes(value as ThemePreference);
}

/** Default: current NestBridge light appearance. */
export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const raw = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);
    if (!raw) {
      return 'light';
    }
    if (isValidThemePreference(raw)) {
      return raw;
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

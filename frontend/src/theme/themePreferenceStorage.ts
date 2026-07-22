import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemePreference } from './palettes';

const THEME_PREFERENCE_KEY = 'nestbridge_theme_preference';

/** Selectable themes shown in Settings (excludes deprecated aliases). */
export const SELECTABLE_THEME_PREFERENCES = [
  'light',
  'coastal-blue-light',
  'coastal-blue-dark',
  'sunset-savanna-light',
  'sunset-savanna-dark',
  'kente-vibrant-light',
  'kente-vibrant-dark',
] as const satisfies readonly ThemePreference[];

const VALID: ThemePreference[] = [
  ...SELECTABLE_THEME_PREFERENCES,
  'dark-teal',
  'dark-warm',
  'dark-bold',
];

function migrateLegacyPreference(raw: string): ThemePreference {
  if (raw === 'dark' || raw === 'dark-teal') return 'coastal-blue-dark';
  if (raw === 'dark-warm') return 'sunset-savanna-dark';
  if (raw === 'dark-bold') return 'kente-vibrant-dark';
  if (raw === 'system') return 'light';
  return 'light';
}

export function isValidThemePreference(
  value: unknown,
): value is ThemePreference {
  return typeof value === 'string' && VALID.includes(value as ThemePreference);
}

function normalizePreference(preference: ThemePreference): ThemePreference {
  if (preference === 'dark-teal') return 'coastal-blue-dark';
  if (preference === 'dark-warm') return 'sunset-savanna-dark';
  if (preference === 'dark-bold') return 'kente-vibrant-dark';
  return preference;
}

/** Default: Original NestBridge light. Persists via AsyncStorage. */
export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const raw = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    if (!raw) {
      return 'light';
    }
    if (isValidThemePreference(raw)) {
      const normalized = normalizePreference(raw);
      if (normalized !== raw) {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, normalized);
      }
      return normalized;
    }
    const migrated = migrateLegacyPreference(raw);
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, migrated);
    return migrated;
  } catch (error) {
    console.warn('[themePreferenceStorage] load failed', error);
    return 'light';
  }
}

export async function saveThemePreference(
  preference: ThemePreference,
): Promise<void> {
  const next = normalizePreference(
    isValidThemePreference(preference) ? preference : 'light',
  );
  try {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, next);
  } catch (error) {
    console.warn('[themePreferenceStorage] save failed', error);
  }
}

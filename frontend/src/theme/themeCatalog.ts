import type { ThemePreference } from './palettes';
import { themeTokensForPreference } from './palettes';
import { SELECTABLE_THEME_PREFERENCES } from './themePreferenceStorage';

export type ThemeOption = {
  id: ThemePreference;
  label: string;
  subtitle: string;
  swatchBackground: string;
  swatchSurface: string;
  swatchPrimary: string;
  swatchAccent: string;
};

type SelectableTheme = (typeof SELECTABLE_THEME_PREFERENCES)[number];

const LABELS: Record<SelectableTheme, { label: string; subtitle: string }> = {
  light: {
    label: 'Original',
    subtitle: 'Default NestBridge navy & teal',
  },
  'coastal-blue-light': {
    label: 'Coastal Blue',
    subtitle: 'Light coastal navy and coral',
  },
  'coastal-blue-dark': {
    label: 'Coastal Blue Dark',
    subtitle: 'Night coastal blues',
  },
  'sunset-savanna-light': {
    label: 'Sunset Savanna',
    subtitle: 'Light forest green and amber',
  },
  'sunset-savanna-dark': {
    label: 'Sunset Savanna Dark',
    subtitle: 'Night savanna greens',
  },
  'kente-vibrant-light': {
    label: 'Kente Vibrant',
    subtitle: 'Light plum, gold, and emerald',
  },
  'kente-vibrant-dark': {
    label: 'Kente Vibrant Dark',
    subtitle: 'Night kente accents',
  },
};

export const THEME_OPTIONS: ThemeOption[] = SELECTABLE_THEME_PREFERENCES.map(
  (id) => {
    const tokens = themeTokensForPreference(id);
    const meta = LABELS[id];
    return {
      id,
      label: meta.label,
      subtitle: meta.subtitle,
      swatchBackground: tokens.colors.background,
      swatchSurface: tokens.colors.surface,
      swatchPrimary: tokens.gradients.header[0],
      swatchAccent: tokens.colors.sos,
    };
  },
);

/**
 * NestBridge color palettes — light (default) plus three dark variants.
 * Layout/spacing never change between variants; only these tokens swap.
 */

export type ColorPalette = {
  navy: string;
  navyMid: string;
  tealDeep: string;
  teal: string;
  tealBright: string;
  gold: string;
  terracotta: string;
  warmCream: string;
  /** Always pure white — never reuse as a dark surface. */
  white: string;
  background: string;
  /** Card / panel fill (light: white; dark: elevated surface). */
  surface: string;
  /** Subtle raised panel behind icons / chips. */
  surfaceElevated: string;
  /** Text/icons on primary CTAs and header gradients. */
  onPrimary: string;
  /** Glyphs on tint / accent icon wells (dark-bold: near-black). */
  onAccent: string;
  /** Links, active accents, recommendation reasons. */
  primaryAction: string;
  secondaryAction: string;
  placeholder: string;
  disabled: string;
  disabledText: string;
  error: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  /** Active bottom-tab label/icon color. */
  tabActive: string;
  /** SOS circle fill. */
  sos: string;
  /** SOS circle ring. */
  sosBorder: string;
};

export type TintPalette = {
  teal: string;
  gold: string;
  terracotta: string;
  navy: string;
  cream: string;
};

export type GradientStops = readonly [string, string, ...string[]];

export type GradientPalette = {
  header: GradientStops;
  headerCompact: GradientStops;
  accent: GradientStops;
};

export type ShadowRecipe = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowPalette = {
  none: ShadowRecipe;
  card: ShadowRecipe;
  raised: ShadowRecipe;
  floating: ShadowRecipe;
};

export type OverlayPalette = {
  scrim: string;
  scrimStrong: string;
};

/** Variant-specific chrome that is not a simple color swap. */
export type ThemeChrome = {
  /** SOS ring thickness in pt. */
  sosBorderWidth: number;
  /** Icon wells use solid accent fills with onAccent glyphs. */
  solidAccentBlocks: boolean;
  /** Cards rely on surface contrast instead of borders. */
  minimalBorders: boolean;
  /** dark-bold uses a flat solid header fill. */
  headerMode: 'gradient' | 'solid';
};

/** User-selectable appearance. Light is the default. */
export type ThemePreference =
  | 'light'
  | 'dark-teal'
  | 'dark-warm'
  | 'dark-bold';

/** Coarse scheme for status bar / React Navigation base theme. */
export type ColorSchemeName = 'light' | 'dark';

export type AppThemeTokens = {
  scheme: ColorSchemeName;
  variant: ThemePreference;
  colors: ColorPalette;
  tints: TintPalette;
  gradients: GradientPalette;
  shadows: ShadowPalette;
  overlays: OverlayPalette;
  chrome: ThemeChrome;
};

const lightChrome: ThemeChrome = {
  sosBorderWidth: 4,
  solidAccentBlocks: false,
  minimalBorders: false,
  headerMode: 'gradient',
};

const darkTealChrome: ThemeChrome = {
  sosBorderWidth: 4,
  solidAccentBlocks: false,
  minimalBorders: false,
  headerMode: 'gradient',
};

const darkWarmChrome: ThemeChrome = {
  sosBorderWidth: 4,
  solidAccentBlocks: false,
  minimalBorders: false,
  headerMode: 'gradient',
};

const darkBoldChrome: ThemeChrome = {
  sosBorderWidth: 5,
  solidAccentBlocks: true,
  minimalBorders: true,
  headerMode: 'solid',
};

/** Current production light theme — do not alter brand hues. */
export const lightColors: ColorPalette = {
  navy: '#0C1735',
  navyMid: '#142247',
  tealDeep: '#135062',
  teal: '#0F7871',
  tealBright: '#1AA68C',
  gold: '#D4A017',
  terracotta: '#D85A30',
  warmCream: '#FBF8F2',
  white: '#FFFFFF',
  background: '#EFF5F3',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F8F7',
  onPrimary: '#FFFFFF',
  onAccent: '#0F7871',
  primaryAction: '#0F7871',
  secondaryAction: '#135062',
  placeholder: '#9CA3AF',
  disabled: '#E5E9E7',
  disabledText: '#9CA3AF',
  error: '#C0392B',
  textPrimary: '#21273D',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#D8DEDC',
  success: '#2C8A7C',
  warning: '#D4A017',
  danger: '#C0392B',
  tabActive: '#0F7871',
  sos: '#C0392B',
  sosBorder: '#FFFFFF',
};

export const lightTints: TintPalette = {
  teal: '#E3F1EE',
  gold: '#F7ECCF',
  terracotta: '#F8E3D9',
  navy: '#E4E8F0',
  cream: lightColors.warmCream,
};

export const lightGradients: GradientPalette = {
  header: [
    lightColors.navy,
    lightColors.navyMid,
    lightColors.tealDeep,
    lightColors.teal,
  ],
  headerCompact: [lightColors.navy, lightColors.tealDeep],
  accent: [lightColors.teal, lightColors.tealBright],
};

export const lightOverlays: OverlayPalette = {
  scrim: 'rgba(12, 23, 53, 0.45)',
  scrimStrong: 'rgba(12, 23, 53, 0.6)',
};

function makeShadows(shadowColor: string): ShadowPalette {
  return {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    card: {
      shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    raised: {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    floating: {
      shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 6,
    },
  };
}

export const lightShadows = makeShadows(lightColors.navy);

const DARK_BORDER = 'rgba(255, 255, 255, 0.08)';

/** dark-teal — cool navy/teal night surfaces. */
export const darkTealColors: ColorPalette = {
  navy: '#0B1220',
  navyMid: '#14342E',
  tealDeep: '#1F4A40',
  teal: '#6FA396',
  tealBright: '#6FA396',
  gold: '#C9A860',
  terracotta: '#B8694A',
  warmCream: '#151E33',
  white: '#FFFFFF',
  background: '#0B1220',
  surface: '#151E33',
  surfaceElevated: '#1A2740',
  onPrimary: '#F3EFE7',
  onAccent: '#6FA396',
  primaryAction: '#6FA396',
  secondaryAction: '#6FA396',
  placeholder: '#8A93A6',
  disabled: '#1A2740',
  disabledText: '#8A93A6',
  error: '#B8694A',
  textPrimary: '#F3EFE7',
  textSecondary: '#8A93A6',
  textTertiary: '#8A93A6',
  border: DARK_BORDER,
  success: '#6FA396',
  warning: '#C9A860',
  danger: '#B8694A',
  tabActive: '#6FA396',
  sos: '#B8694A',
  sosBorder: '#FFFFFF',
};

export const darkTealTints: TintPalette = {
  teal: '#1A3030',
  gold: '#2E2A1A',
  terracotta: '#2E221C',
  navy: '#151E33',
  cream: darkTealColors.warmCream,
};

export const darkTealGradients: GradientPalette = {
  // 135deg: #0B1220 → #14342E → #1F4A40
  header: ['#0B1220', '#14342E', '#1F4A40'],
  headerCompact: ['#0B1220', '#1F4A40'],
  accent: [darkTealColors.teal, darkTealColors.tealBright],
};

export const darkTealOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const darkTealShadows = makeShadows('#000000');

/** dark-warm — charcoal / terracotta night surfaces. */
export const darkWarmColors: ColorPalette = {
  navy: '#1A1410',
  navyMid: '#2E1E16',
  tealDeep: '#3D2418',
  teal: '#5E9A88',
  tealBright: '#5E9A88',
  gold: '#D9A44E',
  terracotta: '#C9673E',
  warmCream: '#231A14',
  white: '#FFFFFF',
  background: '#17110D',
  surface: '#231A14',
  surfaceElevated: '#2C2119',
  onPrimary: '#F5EFE6',
  onAccent: '#D9A44E',
  primaryAction: '#D9A44E',
  secondaryAction: '#C9673E',
  placeholder: '#A08E7D',
  disabled: '#2C2119',
  disabledText: '#A08E7D',
  error: '#C9673E',
  textPrimary: '#F5EFE6',
  textSecondary: '#A08E7D',
  textTertiary: '#A08E7D',
  border: DARK_BORDER,
  success: '#5E9A88',
  warning: '#D9A44E',
  danger: '#C9673E',
  tabActive: '#D9A44E',
  sos: '#C9673E',
  sosBorder: '#FFFFFF',
};

export const darkWarmTints: TintPalette = {
  teal: '#1C2A26',
  gold: '#332818',
  terracotta: '#332018',
  navy: '#231A14',
  cream: darkWarmColors.warmCream,
};

export const darkWarmGradients: GradientPalette = {
  // 135deg: #1A1410 → #2E1E16 → #3D2418
  header: ['#1A1410', '#2E1E16', '#3D2418'],
  headerCompact: ['#1A1410', '#3D2418'],
  accent: [darkWarmColors.gold, darkWarmColors.terracotta],
};

export const darkWarmOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const darkWarmShadows = makeShadows('#000000');

/** dark-bold — true black with solid accent blocks. */
export const darkBoldColors: ColorPalette = {
  navy: '#1C5A48',
  navyMid: '#1C5A48',
  tealDeep: '#1C5A48',
  teal: '#3EBBA0',
  tealBright: '#3EBBA0',
  gold: '#E0B24E',
  terracotta: '#D9704F',
  warmCream: '#19191C',
  white: '#FFFFFF',
  background: '#0D0D0F',
  surface: '#19191C',
  surfaceElevated: '#19191C',
  onPrimary: '#F5F5F0',
  onAccent: '#0D0D0F',
  primaryAction: '#3EBBA0',
  secondaryAction: '#E0B24E',
  placeholder: '#8A8C93',
  disabled: '#19191C',
  disabledText: '#8A8C93',
  error: '#D9704F',
  textPrimary: '#F5F5F0',
  textSecondary: '#8A8C93',
  textTertiary: '#8A8C93',
  border: 'transparent',
  success: '#3EBBA0',
  warning: '#E0B24E',
  danger: '#D9704F',
  tabActive: '#FFFFFF',
  sos: '#D9704F',
  sosBorder: '#0D0D0F',
};

export const darkBoldTints: TintPalette = {
  // Solid fills (not subtle tints) — glyphs use onAccent (#0D0D0F).
  teal: '#3EBBA0',
  gold: '#E0B24E',
  terracotta: '#D9704F',
  navy: '#1C5A48',
  cream: darkBoldColors.warmCream,
};

export const darkBoldGradients: GradientPalette = {
  // Flat solid header — same stop repeated for LinearGradient callers.
  header: ['#1C5A48', '#1C5A48', '#1C5A48'],
  headerCompact: ['#1C5A48', '#1C5A48'],
  accent: [darkBoldColors.teal, darkBoldColors.gold],
};

export const darkBoldOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const darkBoldShadows = makeShadows('#000000');

/** @deprecated Use darkTealColors — kept for any residual imports. */
export const darkColors = darkTealColors;
/** @deprecated Use darkTealTints */
export const darkTints = darkTealTints;
/** @deprecated Use darkTealGradients */
export const darkGradients = darkTealGradients;
/** @deprecated Use darkTealOverlays */
export const darkOverlays = darkTealOverlays;
/** @deprecated Use darkTealShadows */
export const darkShadows = darkTealShadows;

export function themeTokensForPreference(
  preference: ThemePreference,
): AppThemeTokens {
  switch (preference) {
    case 'dark-teal':
      return {
        scheme: 'dark',
        variant: 'dark-teal',
        colors: darkTealColors,
        tints: darkTealTints,
        gradients: darkTealGradients,
        shadows: darkTealShadows,
        overlays: darkTealOverlays,
        chrome: darkTealChrome,
      };
    case 'dark-warm':
      return {
        scheme: 'dark',
        variant: 'dark-warm',
        colors: darkWarmColors,
        tints: darkWarmTints,
        gradients: darkWarmGradients,
        shadows: darkWarmShadows,
        overlays: darkWarmOverlays,
        chrome: darkWarmChrome,
      };
    case 'dark-bold':
      return {
        scheme: 'dark',
        variant: 'dark-bold',
        colors: darkBoldColors,
        tints: darkBoldTints,
        gradients: darkBoldGradients,
        shadows: darkBoldShadows,
        overlays: darkBoldOverlays,
        chrome: darkBoldChrome,
      };
    case 'light':
    default:
      return {
        scheme: 'light',
        variant: 'light',
        colors: lightColors,
        tints: lightTints,
        gradients: lightGradients,
        shadows: lightShadows,
        overlays: lightOverlays,
        chrome: lightChrome,
      };
  }
}

/**
 * @deprecated Prefer themeTokensForPreference — maps coarse light/dark only.
 */
export function themeTokensForScheme(scheme: ColorSchemeName): AppThemeTokens {
  return themeTokensForPreference(scheme === 'dark' ? 'dark-teal' : 'light');
}

/**
 * NestBridge color palettes — light (default / current brand) and dark.
 * Brand hues (navy, teal, gold, terracotta) stay consistent; surfaces adapt.
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
  white: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
};

export type TintPalette = {
  teal: string;
  gold: string;
  terracotta: string;
  navy: string;
  cream: string;
};

export type GradientPalette = {
  header: readonly [string, string, string, string];
  headerCompact: readonly [string, string];
  accent: readonly [string, string];
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
  textPrimary: '#21273D',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#D8DEDC',
  success: '#2C8A7C',
  warning: '#D4A017',
  danger: '#C0392B',
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

/**
 * Dark surfaces with unchanged brand CTAs / accents.
 * Cards use elevated navy panels; text is light for contrast.
 */
export const darkColors: ColorPalette = {
  navy: '#0C1735',
  navyMid: '#1A2A4A',
  tealDeep: '#1A6B7A',
  teal: '#1AA68C',
  tealBright: '#2BC4A8',
  gold: '#E0B03A',
  terracotta: '#E06A42',
  warmCream: '#1A2233',
  white: '#162033',
  background: '#0B1220',
  textPrimary: '#F2F4F7',
  textSecondary: '#A8B0C0',
  textTertiary: '#7C879A',
  border: '#2A3548',
  success: '#3BA899',
  warning: '#E0B03A',
  danger: '#E0554A',
};

export const darkTints: TintPalette = {
  teal: '#16353A',
  gold: '#3A3218',
  terracotta: '#3A241C',
  navy: '#1A2438',
  cream: darkColors.warmCream,
};

export const darkGradients: GradientPalette = {
  header: [
    darkColors.navy,
    darkColors.navyMid,
    darkColors.tealDeep,
    darkColors.teal,
  ],
  headerCompact: [darkColors.navy, darkColors.tealDeep],
  accent: [darkColors.teal, darkColors.tealBright],
};

export const darkOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const darkShadows = makeShadows('#000000');

export type ColorSchemeName = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

export type AppThemeTokens = {
  scheme: ColorSchemeName;
  colors: ColorPalette;
  tints: TintPalette;
  gradients: GradientPalette;
  shadows: ShadowPalette;
  overlays: OverlayPalette;
};

export function themeTokensForScheme(scheme: ColorSchemeName): AppThemeTokens {
  if (scheme === 'dark') {
    return {
      scheme: 'dark',
      colors: darkColors,
      tints: darkTints,
      gradients: darkGradients,
      shadows: darkShadows,
      overlays: darkOverlays,
    };
  }
  return {
    scheme: 'light',
    colors: lightColors,
    tints: lightTints,
    gradients: lightGradients,
    shadows: lightShadows,
    overlays: lightOverlays,
  };
}

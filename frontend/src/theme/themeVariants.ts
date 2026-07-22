/**
 * Additional NestBridge appearance variants (token swap only).
 * Original light theme stays in palettes.ts as `light`.
 */

import type {
  ColorPalette,
  GradientPalette,
  OverlayPalette,
  ShadowPalette,
  ThemeChrome,
  TintPalette,
} from './palettes';

const lightChrome: ThemeChrome = {
  sosBorderWidth: 4,
  solidAccentBlocks: false,
  minimalBorders: false,
  headerMode: 'gradient',
};

const darkChrome: ThemeChrome = {
  sosBorderWidth: 4,
  solidAccentBlocks: false,
  minimalBorders: false,
  headerMode: 'gradient',
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

const DARK_BORDER = 'rgba(255, 255, 255, 0.1)';

/** Coastal Blue — Light */
export const coastalBlueLightColors: ColorPalette = {
  navy: '#16497D',
  navyMid: '#1A5A8A',
  tealDeep: '#1E6B94',
  teal: '#1E6B94',
  tealBright: '#1E6B94',
  gold: '#E8B84B',
  terracotta: '#F0704A',
  warmCream: '#F7F5EF',
  white: '#FFFFFF',
  background: '#F7F5EF',
  surface: '#FFFFFF',
  surfaceElevated: '#FBF9F4',
  onPrimary: '#FFFFFF',
  onAccent: '#16497D',
  primaryAction: '#1E6B94',
  secondaryAction: '#16497D',
  placeholder: '#8A93A6',
  disabled: '#E7E1D4',
  disabledText: '#8A93A6',
  error: '#F0704A',
  textPrimary: '#16497D',
  textSecondary: '#8A93A6',
  textTertiary: '#8A93A6',
  border: '#E7E1D4',
  success: '#1E6B94',
  warning: '#E8B84B',
  danger: '#F0704A',
  tabActive: '#16497D',
  sos: '#F0704A',
  sosBorder: '#FFFFFF',
};

export const coastalBlueLightTints: TintPalette = {
  teal: '#D9EAF3',
  gold: '#F8EED4',
  terracotta: '#FCE4DB',
  navy: '#D6E3F0',
  cream: coastalBlueLightColors.warmCream,
};

export const coastalBlueLightGradients: GradientPalette = {
  header: ['#16497D', '#1E6B94'],
  headerCompact: ['#16497D', '#1E6B94'],
  accent: ['#1E6B94', '#16497D'],
  brandSoft: [
    coastalBlueLightColors.warmCream,
    coastalBlueLightTints.teal,
    coastalBlueLightTints.navy,
  ],
};

export const coastalBlueLightOverlays: OverlayPalette = {
  scrim: 'rgba(22, 73, 125, 0.45)',
  scrimStrong: 'rgba(22, 73, 125, 0.6)',
};

export const coastalBlueLightShadows = makeShadows('#16497D');
export const coastalBlueLightChrome = lightChrome;

/** Coastal Blue — Dark */
export const coastalBlueDarkColors: ColorPalette = {
  navy: '#0B1826',
  navyMid: '#123049',
  tealDeep: '#123049',
  teal: '#6FB4D9',
  tealBright: '#6FB4D9',
  gold: '#D9B255',
  terracotta: '#E88A64',
  warmCream: '#132538',
  white: '#FFFFFF',
  background: '#0B1826',
  surface: '#132538',
  surfaceElevated: '#1A3048',
  onPrimary: '#EAF2F8',
  onAccent: '#6FB4D9',
  primaryAction: '#6FB4D9',
  secondaryAction: '#E88A64',
  placeholder: '#7C93A8',
  disabled: '#1A3048',
  disabledText: '#7C93A8',
  error: '#E88A64',
  textPrimary: '#EAF2F8',
  textSecondary: '#7C93A8',
  textTertiary: '#7C93A8',
  border: DARK_BORDER,
  success: '#6FB4D9',
  warning: '#D9B255',
  danger: '#E88A64',
  tabActive: '#6FB4D9',
  sos: '#E88A64',
  sosBorder: '#FFFFFF',
};

export const coastalBlueDarkTints: TintPalette = {
  teal: '#1A3548',
  gold: '#3A3218',
  terracotta: '#3A2418',
  navy: '#132538',
  cream: coastalBlueDarkColors.warmCream,
};

export const coastalBlueDarkGradients: GradientPalette = {
  header: ['#0B1826', '#123049'],
  headerCompact: ['#0B1826', '#123049'],
  accent: ['#6FB4D9', '#E88A64'],
  brandSoft: [
    coastalBlueDarkColors.surfaceElevated,
    coastalBlueDarkTints.teal,
    coastalBlueDarkTints.navy,
  ],
};

export const coastalBlueDarkOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const coastalBlueDarkShadows = makeShadows('#000000');
export const coastalBlueDarkChrome = darkChrome;

/** Sunset Savanna — Light */
export const sunsetSavannaLightColors: ColorPalette = {
  navy: '#1F4D3D',
  navyMid: '#2C634E',
  tealDeep: '#3A7A5C',
  teal: '#3A7A5C',
  tealBright: '#3A7A5C',
  gold: '#C99A3D',
  terracotta: '#D97D33',
  warmCream: '#FBF6EE',
  white: '#FFFFFF',
  background: '#FBF6EE',
  surface: '#FFFFFF',
  surfaceElevated: '#FDF9F3',
  onPrimary: '#FFFFFF',
  onAccent: '#1F4D3D',
  primaryAction: '#3A7A5C',
  secondaryAction: '#1F4D3D',
  placeholder: '#9B9382',
  disabled: '#ECE3D0',
  disabledText: '#9B9382',
  error: '#D97D33',
  textPrimary: '#1F4D3D',
  textSecondary: '#9B9382',
  textTertiary: '#9B9382',
  border: '#ECE3D0',
  success: '#3A7A5C',
  warning: '#C99A3D',
  danger: '#D97D33',
  tabActive: '#1F4D3D',
  sos: '#D97D33',
  sosBorder: '#FFFFFF',
};

export const sunsetSavannaLightTints: TintPalette = {
  teal: '#DCECE3',
  gold: '#F5EAD0',
  terracotta: '#F8E4D4',
  navy: '#D6E4DD',
  cream: sunsetSavannaLightColors.warmCream,
};

export const sunsetSavannaLightGradients: GradientPalette = {
  header: ['#1F4D3D', '#3A7A5C'],
  headerCompact: ['#1F4D3D', '#3A7A5C'],
  accent: ['#3A7A5C', '#D97D33'],
  brandSoft: [
    sunsetSavannaLightColors.warmCream,
    sunsetSavannaLightTints.teal,
    sunsetSavannaLightTints.navy,
  ],
};

export const sunsetSavannaLightOverlays: OverlayPalette = {
  scrim: 'rgba(31, 77, 61, 0.45)',
  scrimStrong: 'rgba(31, 77, 61, 0.6)',
};

export const sunsetSavannaLightShadows = makeShadows('#1F4D3D');
export const sunsetSavannaLightChrome = lightChrome;

/** Sunset Savanna — Dark */
export const sunsetSavannaDarkColors: ColorPalette = {
  navy: '#14201A',
  navyMid: '#20372A',
  tealDeep: '#20372A',
  teal: '#6FBF93',
  tealBright: '#6FBF93',
  gold: '#D9B255',
  terracotta: '#E0A868',
  warmCream: '#1C2D22',
  white: '#FFFFFF',
  background: '#14201A',
  surface: '#1C2D22',
  surfaceElevated: '#24382C',
  onPrimary: '#EFF5F0',
  onAccent: '#6FBF93',
  primaryAction: '#6FBF93',
  secondaryAction: '#E0A868',
  placeholder: '#8FA697',
  disabled: '#24382C',
  disabledText: '#8FA697',
  error: '#E0A868',
  textPrimary: '#EFF5F0',
  textSecondary: '#8FA697',
  textTertiary: '#8FA697',
  border: DARK_BORDER,
  success: '#6FBF93',
  warning: '#D9B255',
  danger: '#E0A868',
  tabActive: '#6FBF93',
  sos: '#E0A868',
  sosBorder: '#FFFFFF',
};

export const sunsetSavannaDarkTints: TintPalette = {
  teal: '#1E3A2C',
  gold: '#3A3218',
  terracotta: '#3A2C18',
  navy: '#1C2D22',
  cream: sunsetSavannaDarkColors.warmCream,
};

export const sunsetSavannaDarkGradients: GradientPalette = {
  header: ['#14201A', '#20372A'],
  headerCompact: ['#14201A', '#20372A'],
  accent: ['#6FBF93', '#E0A868'],
  brandSoft: [
    sunsetSavannaDarkColors.surfaceElevated,
    sunsetSavannaDarkTints.teal,
    sunsetSavannaDarkTints.navy,
  ],
};

export const sunsetSavannaDarkOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const sunsetSavannaDarkShadows = makeShadows('#000000');
export const sunsetSavannaDarkChrome = darkChrome;

/** Kente Vibrant — Light */
export const kenteVibrantLightColors: ColorPalette = {
  navy: '#4A1942',
  navyMid: '#5A2250',
  tealDeep: '#6B2A5E',
  teal: '#1E7A5F',
  tealBright: '#1E7A5F',
  gold: '#E0A72E',
  terracotta: '#C23B3B',
  warmCream: '#FAF6F2',
  white: '#FFFFFF',
  background: '#FAF6F2',
  surface: '#FFFFFF',
  surfaceElevated: '#FDF9F6',
  onPrimary: '#FFFFFF',
  onAccent: '#4A1942',
  primaryAction: '#6B2A5E',
  secondaryAction: '#1E7A5F',
  placeholder: '#A296A0',
  disabled: '#EEE1E9',
  disabledText: '#A296A0',
  error: '#C23B3B',
  textPrimary: '#4A1942',
  textSecondary: '#A296A0',
  textTertiary: '#A296A0',
  border: '#EEE1E9',
  success: '#1E7A5F',
  warning: '#E0A72E',
  danger: '#C23B3B',
  tabActive: '#4A1942',
  sos: '#C23B3B',
  sosBorder: '#FFFFFF',
};

export const kenteVibrantLightTints: TintPalette = {
  teal: '#D6EBE3',
  gold: '#F7EED4',
  terracotta: '#F5DADA',
  navy: '#EAD8E6',
  cream: kenteVibrantLightColors.warmCream,
};

export const kenteVibrantLightGradients: GradientPalette = {
  header: ['#4A1942', '#6B2A5E'],
  headerCompact: ['#4A1942', '#6B2A5E'],
  accent: ['#6B2A5E', '#E0A72E'],
  brandSoft: [
    kenteVibrantLightColors.warmCream,
    kenteVibrantLightTints.navy,
    kenteVibrantLightTints.gold,
  ],
};

export const kenteVibrantLightOverlays: OverlayPalette = {
  scrim: 'rgba(74, 25, 66, 0.45)',
  scrimStrong: 'rgba(74, 25, 66, 0.6)',
};

export const kenteVibrantLightShadows = makeShadows('#4A1942');
export const kenteVibrantLightChrome = lightChrome;

/** Kente Vibrant — Dark */
export const kenteVibrantDarkColors: ColorPalette = {
  navy: '#1A1020',
  navyMid: '#2E1730',
  tealDeep: '#2E1730',
  teal: '#4FAE87',
  tealBright: '#4FAE87',
  gold: '#E0B24E',
  terracotta: '#D96A6A',
  warmCream: '#241A2C',
  white: '#FFFFFF',
  background: '#1A1020',
  surface: '#241A2C',
  surfaceElevated: '#2E2238',
  onPrimary: '#F3ECF1',
  onAccent: '#E0B24E',
  primaryAction: '#E0B24E',
  secondaryAction: '#4FAE87',
  placeholder: '#8E7A8A',
  disabled: '#2E2238',
  disabledText: '#8E7A8A',
  error: '#D96A6A',
  textPrimary: '#F3ECF1',
  textSecondary: '#8E7A8A',
  textTertiary: '#8E7A8A',
  border: DARK_BORDER,
  success: '#4FAE87',
  warning: '#E0B24E',
  danger: '#D96A6A',
  tabActive: '#E0B24E',
  sos: '#D96A6A',
  sosBorder: '#FFFFFF',
};

export const kenteVibrantDarkTints: TintPalette = {
  teal: '#1E3A30',
  gold: '#3A3218',
  terracotta: '#3A1E24',
  navy: '#241A2C',
  cream: kenteVibrantDarkColors.warmCream,
};

export const kenteVibrantDarkGradients: GradientPalette = {
  header: ['#1A1020', '#2E1730'],
  headerCompact: ['#1A1020', '#2E1730'],
  accent: ['#E0B24E', '#4FAE87'],
  brandSoft: [
    kenteVibrantDarkColors.surfaceElevated,
    kenteVibrantDarkTints.navy,
    kenteVibrantDarkTints.gold,
  ],
};

export const kenteVibrantDarkOverlays: OverlayPalette = {
  scrim: 'rgba(0, 0, 0, 0.55)',
  scrimStrong: 'rgba(0, 0, 0, 0.72)',
};

export const kenteVibrantDarkShadows = makeShadows('#000000');
export const kenteVibrantDarkChrome = darkChrome;

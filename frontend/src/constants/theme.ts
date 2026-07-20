/**
 * NestBridge design tokens — single source of truth for all visual styling.
 *
 * Usage:
 *   import { colors, fontSizes, fontFamilies, lineHeights, spacing, borderRadius, gradients, layout, shadows } from '../constants/theme';
 *   // Prefer useTheme() / useThemedStyles() in components so light/dark update at runtime.
 *
 * Do NOT hardcode hex values, font sizes, or spacing in components.
 * If a token is missing, add it to theme/palettes.ts (colors) or here (layout).
 */

import {
  lightColors,
  lightTints,
  lightGradients,
  lightShadows,
  lightOverlays,
} from '../theme/palettes';

/** @deprecated Prefer useTheme().colors — static light palette for module-scope fallbacks. */
export const colors = lightColors;

export type ColorToken = keyof typeof colors;

/** @deprecated Prefer useTheme().tints */
export const tints = lightTints;

export type TintToken = keyof typeof tints;

export const fontFamilies = {
  regular: 'Poppins_400Regular',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

export const fontSizes = {
  display: 32,
  heading: 22,
  subheading: 17,
  body: 16,
  caption: 13,
  /** Badges and dense chrome only — never body copy. */
  micro: 10,
} as const;

export type FontSizeToken = keyof typeof fontSizes;

export const lineHeights = {
  display: 38,
  heading: 28,
  subheading: 24,
  body: 24,
  caption: 18,
  micro: 12,
} as const;

export type LineHeightToken = keyof typeof lineHeights;

export const fontWeights = {
  regular: '400',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeightToken = keyof typeof fontWeights;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export type SpacingToken = keyof typeof spacing;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

export const borderWidths = {
  hairline: 1,
  strong: 1.5,
} as const;

export type BorderWidthToken = keyof typeof borderWidths;

/** Minimum interactive control heights. */
export const controlHeights = {
  sm: 40,
  md: 48,
  lg: 52,
} as const;

export type ControlHeightToken = keyof typeof controlHeights;

/** Standard icon sizes for AppIcon / Ionicons. */
export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export type IconSizeToken = keyof typeof iconSizes;

/** Initials avatar diameters. */
export const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  /** Profile / detail heroes only. */
  xl: 72,
} as const;

export type AvatarSizeToken = keyof typeof avatarSizes;

/** Minimum touch target edge length (pt). */
export const touchTarget = 44;

export const layout = {
  screenPaddingHorizontal: spacing.lg,
  tabBarHeight: 56,
  tabBarBottomInset: spacing.sm,
  sosDockHeight: 52,
  sosButtonSize: 56,
  sosRaise: spacing.lg,
  /** Icon wells on empty states and quick-action tiles. */
  iconTileSize: 56,
  sectionGap: spacing.lg,
  scrollBottomInset: 72,
  scrollBottomInsetWithSos: 124,
  listingCardWidth: 272,
  carouselMinHeight: 168,
  cardPadding: spacing.md,
  cardPaddingLarge: spacing.lg,
  /** Top inset offset below safe area on auth forms. */
  authContentTop: spacing.lg,
} as const;

/** @deprecated Prefer useTheme().gradients */
export const gradients = lightGradients;

export const motion = {
  durationFast: 200,
  durationNormal: 400,
} as const;

/** @deprecated Prefer useTheme().shadows */
export const shadows = lightShadows;

/** @deprecated Prefer useTheme().overlays */
export const overlays = lightOverlays;

const theme = {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  iconSizes,
  avatarSizes,
  touchTarget,
  layout,
  gradients,
  motion,
  shadows,
  overlays,
};

export default theme;

/**
 * NestBridge design tokens — single source of truth for all visual styling.
 *
 * Usage:
 *   import { colors, fontSizes, fontFamilies, lineHeights, spacing, borderRadius, gradients, layout } from '../constants/theme';
 *
 * Do NOT hardcode hex values, font sizes, or spacing in components.
 * If a token is missing, add it here first.
 */

export const colors = {
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
} as const;

export type ColorToken = keyof typeof colors;

export const fontFamilies = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

export const fontSizes = {
  display: 32,
  heading: 22,
  subheading: 17,
  body: 16,
  caption: 13,
} as const;

export type FontSizeToken = keyof typeof fontSizes;

export const lineHeights = {
  display: 38,
  heading: 28,
  subheading: 24,
  body: 24,
  caption: 18,
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
} as const;

export type SpacingToken = keyof typeof spacing;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

export const layout = {
  screenPaddingHorizontal: spacing.lg,
  tabBarHeight: 56,
  tabBarBottomInset: spacing.sm,
  sosDockHeight: 52,
  sosButtonSize: 56,
  sosRaise: spacing.lg,
  sectionGap: spacing.lg,
  scrollBottomInset: 72,
  scrollBottomInsetWithSos: 124,
  listingCardWidth: 272,
  carouselMinHeight: 168,
} as const;

export const gradients = {
  header: [colors.navy, colors.navyMid, colors.tealDeep, colors.teal] as const,
  headerCompact: [colors.navy, colors.tealDeep] as const,
  accent: [colors.teal, colors.tealBright] as const,
} as const;

export const motion = {
  durationFast: 200,
  durationNormal: 400,
} as const;

const theme = {
  colors,
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  gradients,
  motion,
};

export default theme;

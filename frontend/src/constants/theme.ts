/**
 * NestBridge design tokens — single source of truth for all visual styling.
 *
 * Usage:
 *   import { colors, fontSizes, spacing, borderRadius, gradients } from '../constants/theme';
 *
 * Do NOT hardcode hex values, font sizes, or spacing in components.
 * If a token is missing, add it here first.
 *
 * Note: gold and terracotta are marked for prototype verification before treating as final.
 */

export const colors = {
  // Brand gradient (header, splash)
  navy: '#0C1735',
  navyMid: '#142247',
  tealDeep: '#135062',
  teal: '#0F7871',
  tealBright: '#1AA68C',

  // Accent — VERIFY against live prototype before treating as final
  gold: '#D4A017',
  terracotta: '#D85A30',
  warmCream: '#FBF8F2',

  // Neutrals
  white: '#FFFFFF',
  background: '#EFF5F3',
  textPrimary: '#21273D',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#D8DEDC',

  // Semantic
  success: '#2C8A7C',
  warning: '#D4A017',
  danger: '#C0392B',
} as const;

export type ColorToken = keyof typeof colors;

export const fontSizes = {
  display: 28,
  heading: 20,
  subheading: 16,
  body: 14,
  caption: 12,
} as const;

export type FontSizeToken = keyof typeof fontSizes;

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

/** Gradient color stops for expo-linear-gradient (header, splash, hero panels). */
export const gradients = {
  header: [colors.navy, colors.navyMid, colors.tealDeep, colors.teal] as const,
  headerCompact: [colors.navy, colors.tealDeep] as const,
  accent: [colors.teal, colors.tealBright] as const,
} as const;

const theme = {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
};

export default theme;

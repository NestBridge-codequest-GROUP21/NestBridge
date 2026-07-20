import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import type { AppThemeTokens } from './palettes';

export function navigationThemeFromTokens(
  tokens: AppThemeTokens,
): NavigationTheme {
  const base = tokens.scheme === 'dark' ? NavDarkTheme : NavLightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: tokens.colors.teal,
      background: tokens.colors.background,
      card: tokens.colors.white,
      text: tokens.colors.textPrimary,
      border: tokens.colors.border,
      notification: tokens.colors.danger,
    },
  };
}

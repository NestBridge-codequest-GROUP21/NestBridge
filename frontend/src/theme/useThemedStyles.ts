import { useMemo } from 'react';
import { useTheme, type AppTheme } from './ThemeContext';

/**
 * Build StyleSheet (or any style object) from the active theme.
 * Recreates when the resolved light/dark scheme changes.
 *
 * Pass a **module-level** factory for a stable reference:
 *   const styles = useThemedStyles(createStyles);
 */
export function useThemedStyles<T>(factory: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme.scheme, factory]);
}

export function createThemedStyles<T>(factory: (theme: AppTheme) => T) {
  return factory;
}

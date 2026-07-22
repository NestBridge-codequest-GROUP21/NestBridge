import { useMemo } from 'react';
import { useTheme, type AppTheme } from './ThemeContext';

/**
 * Build StyleSheet (or any style object) from the active theme.
 * Recreates when the selected variant changes (including dark-to-dark).
 *
 * Pass a **module-level** factory for a stable reference:
 *   const styles = useThemedStyles(createStyles);
 */
export function useThemedStyles<T>(factory: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return useMemo(
    () => factory(theme),
    // preference covers all four variants; scheme alone would miss dark→dark swaps
    [theme.preference, factory],
  );
}

export function createThemedStyles<T>(factory: (theme: AppTheme) => T) {
  return factory;
}

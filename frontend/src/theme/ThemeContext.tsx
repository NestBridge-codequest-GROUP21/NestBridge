import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  type AppThemeTokens,
  type ColorSchemeName,
  type ThemePreference,
  themeTokensForScheme,
} from './palettes';
import {
  loadThemePreference,
  saveThemePreference,
} from './themePreferenceStorage';
import {
  borderRadius,
  borderWidths,
  controlHeights,
  fontFamilies,
  fontSizes,
  fontWeights,
  iconSizes,
  avatarSizes,
  layout,
  lineHeights,
  motion,
  spacing,
  touchTarget,
} from '../constants/theme';

export type AppTheme = AppThemeTokens & {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isReady: boolean;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  borderWidths: typeof borderWidths;
  controlHeights: typeof controlHeights;
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  iconSizes: typeof iconSizes;
  avatarSizes: typeof avatarSizes;
  layout: typeof layout;
  motion: typeof motion;
  touchTarget: typeof touchTarget;
};

const ThemeContext = React.createContext<AppTheme | null>(null);

function resolveScheme(
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ColorSchemeName {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

function buildTheme(
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
  setPreference: (preference: ThemePreference) => void,
  isReady: boolean,
): AppTheme {
  const scheme = resolveScheme(preference, systemScheme);
  const tokens = themeTokensForScheme(scheme);
  return {
    ...tokens,
    preference,
    setPreference,
    isReady,
    spacing,
    borderRadius,
    borderWidths,
    controlHeights,
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    iconSizes,
    avatarSizes,
    layout,
    motion,
    touchTarget,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadThemePreference().then((stored) => {
      if (!cancelled) {
        setPreferenceState(stored);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    void saveThemePreference(next);
  }, []);

  const value = useMemo(
    () => buildTheme(preference, systemScheme, setPreference, isReady),
    [preference, systemScheme, setPreference, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return buildTheme('light', 'light', () => undefined, true);
  }
  return ctx;
}

export function useResolvedScheme(): ColorSchemeName {
  return useTheme().scheme;
}

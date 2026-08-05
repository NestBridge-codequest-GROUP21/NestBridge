import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { InteractionManager } from 'react-native';
import {
  DEFAULT_FEEDBACK_PREFERENCES,
  loadFeedbackPreferences,
  saveFeedbackPreferences,
  setFeedbackPreferencesCache,
  type FeedbackPreferences,
} from '../services/feedbackPreferences';
import { warmFeedbackAssets } from '../services/appFeedback';

type FeedbackPreferencesContextValue = {
  preferences: FeedbackPreferences;
  isReady: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
};

const FeedbackPreferencesContext =
  createContext<FeedbackPreferencesContextValue | null>(null);

export function FeedbackPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<FeedbackPreferences>({
    ...DEFAULT_FEEDBACK_PREFERENCES,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadFeedbackPreferences().then((loaded) => {
      if (cancelled) return;
      setPreferences(loaded);
      setFeedbackPreferencesCache(loaded);
      setIsReady(true);
      if (loaded.soundsEnabled) {
        // Defer audio decode so cold start stays responsive on low-end Android.
        InteractionManager.runAfterInteractions(() => {
          if (!cancelled) {
            void warmFeedbackAssets();
          }
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: FeedbackPreferences) => {
    setPreferences(next);
    setFeedbackPreferencesCache(next);
    void saveFeedbackPreferences(next);
  }, []);

  const setHapticsEnabled = useCallback(
    (enabled: boolean) => {
      persist({ ...preferences, hapticsEnabled: enabled });
    },
    [persist, preferences],
  );

  const setSoundsEnabled = useCallback(
    (enabled: boolean) => {
      const next = { ...preferences, soundsEnabled: enabled };
      persist(next);
      if (enabled) {
        InteractionManager.runAfterInteractions(() => {
          void warmFeedbackAssets();
        });
      }
    },
    [persist, preferences],
  );

  const value = useMemo(
    () => ({
      preferences,
      isReady,
      setHapticsEnabled,
      setSoundsEnabled,
    }),
    [preferences, isReady, setHapticsEnabled, setSoundsEnabled],
  );

  return (
    <FeedbackPreferencesContext.Provider value={value}>
      {children}
    </FeedbackPreferencesContext.Provider>
  );
}

export function useFeedbackPreferences(): FeedbackPreferencesContextValue {
  const ctx = useContext(FeedbackPreferencesContext);
  if (!ctx) {
    return {
      preferences: DEFAULT_FEEDBACK_PREFERENCES,
      isReady: false,
      setHapticsEnabled: () => undefined,
      setSoundsEnabled: () => undefined,
    };
  }
  return ctx;
}

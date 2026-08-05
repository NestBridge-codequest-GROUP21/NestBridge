import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  InteractionManager,
  Linking,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from '../screens/auth/SplashScreen';
import { splashMock } from '../data/studentOnboardingMock';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import { parseResetPasswordToken } from '../utils/parseResetPasswordUrl';
import AuthNavigator from './AuthNavigator';
import { registerPushTokenIfAvailable } from '../services/pushRegistration';
import {
  clearLastBootError,
  recordBootError,
  setBootStage,
} from '../services/bootDiagnostics';
import {
  useTheme,
  useThemedStyles,
  navigationThemeFromTokens,
  type AppTheme,
} from '../theme';

/**
 * Defer the huge authenticated navigator until after splash/auth paint.
 * A static import of AppNavigator (~5k lines + all screens) can ANR Android
 * on cold start; lazy + Suspense keeps the first frame responsive.
 */
const AppNavigator = lazy(() =>
  import('./AppNavigator').then((mod) => {
    const Comp = mod.default;
    if (typeof Comp !== 'function') {
      throw new Error(
        `AppNavigator failed to load (got ${typeof Comp}). Keys: ${Object.keys(mod).join(',')}`,
      );
    }
    return { default: Comp };
  }),
);

/** If auth/profile never settle, leave splash so the app remains usable. */
const SPLASH_FORCE_MS = 10000;

/**
 * Cold start: one branded Splash (≤5s, tap to skip), then Auth or App.
 * Background resume keeps React state — Splash does not show again.
 */
export default function RootNavigator() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { isLoading: profileLoading } = useAccountProfile();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const { colors } = theme;

  const navTheme = navigationThemeFromTokens(theme);
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [forceBoot, setForceBoot] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<string | undefined>();

  useEffect(() => {
    setBootStage('splash_waiting');
    // Never surface prior-launch diagnostics in the UI — clear and keep running clean.
    void clearLastBootError();
  }, []);

  useEffect(() => {
    if (splashDone) {
      return undefined;
    }
    const timer = setTimeout(() => {
      console.warn('[boot] forcing splash dismiss after timeout');
      void recordBootError('splash_force', 'Forced splash dismiss after boot timeout', {
        persist: false,
      });
      setForceBoot(true);
      setSplashDismissed(true);
    }, SPLASH_FORCE_MS);
    return () => clearTimeout(timer);
  }, [splashDone]);

  const handleResetUrl = useCallback(
    (url: string | null | undefined) => {
      try {
        const token = url ? parseResetPasswordToken(url) : null;
        if (!token) {
          return;
        }
        setPasswordResetToken(token);
        if (user) {
          void signOut();
        }
      } catch (error) {
        void recordBootError('reset_url', error);
      }
    },
    [user, signOut],
  );

  useEffect(() => {
    try {
      void Linking.getInitialURL()
        .then(handleResetUrl)
        .catch((error) => {
          void recordBootError('linking_initial', error);
        });
      const subscription = Linking.addEventListener('url', ({ url }) =>
        handleResetUrl(url),
      );
      return () => subscription.remove();
    } catch (error) {
      void recordBootError('linking_subscribe', error);
      return undefined;
    }
  }, [handleResetUrl]);

  const bootReady = forceBoot || (!authLoading && !(user && profileLoading));

  useEffect(() => {
    if (splashDismissed && bootReady) {
      setSplashDone(true);
      setBootStage('splash_dismissed');
      void clearLastBootError();
    }
  }, [splashDismissed, bootReady]);

  useEffect(() => {
    if (!splashDone || !user) {
      return undefined;
    }
    setBootStage('nav_ready');
    // Push after first interactions so it never blocks the UI thread on cold start.
    const handle = InteractionManager.runAfterInteractions(() => {
      setBootStage('push_register');
      void registerPushTokenIfAvailable();
    });
    return () => handle.cancel();
  }, [splashDone, user?.userId]);

  if (!splashDone) {
    if (splashDismissed) {
      return (
        <View style={[styles.lazyHold, { backgroundColor: colors.navy }]}>
          <StatusBar style="light" />
          <ActivityIndicator color={colors.tealBright} size="large" />
        </View>
      );
    }
    return (
      <SplashScreen
        {...splashMock}
        onContinue={() => setSplashDismissed(true)}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <NavigationContainer theme={navTheme}>
        {user ? (
          <Suspense
            fallback={
              <View style={[styles.lazyHold, { backgroundColor: colors.navy }]}>
                <ActivityIndicator color={colors.tealBright} size="large" />
              </View>
            }
          >
            <AppNavigator key={user.userId} />
          </Suspense>
        ) : (
          <AuthNavigator
            key={passwordResetToken ?? 'auth-default'}
            initialResetToken={passwordResetToken}
            onResetTokenConsumed={() => setPasswordResetToken(undefined)}
          />
        )}
      </NavigationContainer>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    lazyHold: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

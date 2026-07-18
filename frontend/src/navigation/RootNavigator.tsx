import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/auth/SplashScreen';
import BootLoader from '../components/BootLoader';
import { splashMock } from '../data/studentOnboardingMock';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import { parseResetPasswordToken } from '../utils/parseResetPasswordUrl';
import AuthNavigator from './AuthNavigator';

/** Defer the heavy authenticated navigator (and its native imports) until after splash/auth. */
const AppNavigator = lazy(() => import('./AppNavigator'));

/**
 * Cold start: branded Splash once per JS session, then Auth or App.
 * Background resume keeps React state — Splash does not show again.
 */
export default function RootNavigator() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { isLoading: profileLoading } = useAccountProfile();
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<string | undefined>();

  const handleResetUrl = useCallback(
    (url: string | null | undefined) => {
      const token = url ? parseResetPasswordToken(url) : null;
      if (!token) {
        return;
      }
      setPasswordResetToken(token);
      if (user) {
        void signOut();
      }
    },
    [user, signOut],
  );

  useEffect(() => {
    void Linking.getInitialURL().then(handleResetUrl).catch(() => undefined);
    const subscription = Linking.addEventListener('url', ({ url }) => handleResetUrl(url));
    return () => subscription.remove();
  }, [handleResetUrl]);

  const bootReady = !authLoading && !(user && profileLoading);

  useEffect(() => {
    if (splashDismissed && bootReady) {
      setSplashDone(true);
    }
  }, [splashDismissed, bootReady]);

  if (!splashDone) {
    return (
      <SplashScreen
        {...splashMock}
        onContinue={() => setSplashDismissed(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Suspense fallback={<BootLoader />}>
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
  );
}

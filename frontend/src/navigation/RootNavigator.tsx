import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/auth/SplashScreen';
import { splashMock } from '../data/studentOnboardingMock';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

/**
 * Cold start: branded Splash once per JS session, then Auth or App.
 * Background resume keeps React state — Splash does not show again.
 */
export default function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: profileLoading } = useAccountProfile();
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

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
      {user ? <AppNavigator key={user.userId} /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

import React, { useEffect, useState } from 'react';
import BootLoader from './src/components/BootLoader';
import AppErrorBoundary from './src/components/AppErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import { AccountProfileProvider } from './src/context/AccountProfileContext';
import RootNavigator from './src/navigation/RootNavigator';
import {
  recordBootError,
  setBootStage,
} from './src/services/bootDiagnostics';

function AppProviders() {
  useEffect(() => {
    setBootStage('providers_mount');
  }, []);

  return (
    <AuthProvider>
      <AccountProfileProvider>
        <RootNavigator />
      </AccountProfileProvider>
    </AuthProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [fontWaitTimedOut, setFontWaitTimedOut] = useState(false);

  useEffect(() => {
    setBootStage('fonts');
  }, []);

  // Never block forever on font loading in a standalone build.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fontsLoaded) {
        void recordBootError(
          'fonts_timeout',
          'Font load exceeded 4s — continuing with system fonts',
        );
      }
      setFontWaitTimedOut(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontWaitTimedOut) {
    return (
      <SafeAreaProvider>
        <BootLoader />
      </SafeAreaProvider>
    );
  }

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <AppProviders />
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

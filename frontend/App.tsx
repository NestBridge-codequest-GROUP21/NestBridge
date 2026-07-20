import React, { useEffect, useState } from 'react';
import BootLoader from './src/components/BootLoader';
import AppErrorBoundary from './src/components/AppErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { AuthProvider } from './src/context/AuthContext';
import { AccountProfileProvider } from './src/context/AccountProfileContext';
import { ThemeProvider } from './src/theme';
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
    <ThemeProvider>
      <AuthProvider>
        <AccountProfileProvider>
          <RootNavigator />
        </AccountProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
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
        <ThemeProvider>
          <BootLoader />
        </ThemeProvider>
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

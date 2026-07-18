import React, { useEffect, useState } from 'react';
import BootLoader from './src/components/BootLoader';
import AppErrorBoundary from './src/components/AppErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import { AccountProfileProvider } from './src/context/AccountProfileContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [fontWaitTimedOut, setFontWaitTimedOut] = useState(false);

  // Never block forever on font loading in a standalone build.
  useEffect(() => {
    const timer = setTimeout(() => setFontWaitTimedOut(true), 4000);
    return () => clearTimeout(timer);
  }, []);

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
        <AuthProvider>
          <AccountProfileProvider>
            <RootNavigator />
          </AccountProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

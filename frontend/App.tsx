import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
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
import { StaffSessionProvider } from './src/context/StaffSessionContext';
import { ThemeProvider } from './src/theme';
import { AppAlertProvider } from './src/context/AppAlertContext';
import RootNavigator from './src/navigation/RootNavigator';
import {
  recordBootError,
  setBootStage,
} from './src/services/bootDiagnostics';
import { colors } from './src/constants/theme';

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Native splash may already be hidden in some environments.
});

function AppProviders({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    setBootStage('providers_mount');
    onReady();
  }, [onReady]);

  return (
    <ThemeProvider>
      <AppAlertProvider>
        <AuthProvider>
          <AccountProfileProvider>
            <StaffSessionProvider>
              <RootNavigator />
            </StaffSessionProvider>
          </AccountProfileProvider>
        </AuthProvider>
      </AppAlertProvider>
    </ThemeProvider>
  );
}

/** Navy hold matching native splash — not a second branded splash. */
function NativeSplashHold() {
  return <View style={styles.hold} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [fontWaitTimedOut, setFontWaitTimedOut] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setBootStage('fonts');
  }, []);

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

  const fontsReady = fontsLoaded || fontWaitTimedOut;

  useEffect(() => {
    if (!fontsReady || !appReady) {
      return;
    }
    void SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsReady, appReady]);

  if (!fontsReady) {
    return (
      <SafeAreaProvider>
        <NativeSplashHold />
      </SafeAreaProvider>
    );
  }

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <AppProviders onReady={() => setAppReady(true)} />
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  hold: {
    flex: 1,
    backgroundColor: colors.navy,
  },
});

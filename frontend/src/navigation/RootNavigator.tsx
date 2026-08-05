import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from '../screens/auth/SplashScreen';
import { splashMock } from '../data/studentOnboardingMock';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import { parseResetPasswordToken } from '../utils/parseResetPasswordUrl';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { registerPushTokenIfAvailable } from '../services/pushRegistration';
import {
  clearLastBootError,
  loadLastBootError,
  recordBootError,
  setBootStage,
} from '../services/bootDiagnostics';
import {
  useTheme,
  useThemedStyles,
  navigationThemeFromTokens,
  type AppTheme,
} from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

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
  const [priorBootError, setPriorBootError] = useState<string | null>(null);

  useEffect(() => {
    setBootStage('splash_waiting');
    void loadLastBootError()
      .then((record) => {
        if (record) {
          setPriorBootError(`${record.stage}: ${record.message}`);
        }
      })
      .catch(() => undefined);
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
    }
  }, [splashDismissed, bootReady]);

  useEffect(() => {
    if (!splashDone) {
      return;
    }
    setBootStage('nav_ready');
    if (user) {
      setBootStage('push_register');
      void registerPushTokenIfAvailable();
    }
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
      {priorBootError ? (
        <View style={styles.banner} accessibilityRole="alert">
          <Text style={styles.bannerTitle}>Previous startup issue</Text>
          <Text style={styles.bannerBody} numberOfLines={4}>
            {priorBootError}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.bannerButton, pressed && styles.pressed]}
            onPress={() => {
              setPriorBootError(null);
              void clearLastBootError();
            }}
            accessibilityRole="button"
            accessibilityLabel="Dismiss previous startup error"
          >
            <Text style={styles.bannerButtonLabel}>Dismiss</Text>
          </Pressable>
        </View>
      ) : null}
      <NavigationContainer theme={navTheme}>
        {user ? (
          <AppNavigator key={user.userId} />
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
    banner: {
      backgroundColor: colors.warmCream,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.xs,
    },
    bannerTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.danger,
    },
    bannerBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
    },
    bannerButton: {
      alignSelf: 'flex-start',
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.tealBright,
    },
    bannerButtonLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.onPrimary,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { AuthSession, AuthUser, RegisterResult } from '../types/auth';
import {
  clearSession,
  loadSession,
  saveSession,
} from '../services/authStorage';
import * as api from '../services/api';
import { registerPushTokenIfAvailable } from '../services/pushRegistration';
import {
  recordBootError,
  setBootStage,
} from '../services/bootDiagnostics';

/** Never leave the branded splash waiting forever on a hung refresh. */
const AUTH_BOOT_TIMEOUT_MS = 25000;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  register: (
    displayName: string,
    email: string,
    password: string,
    keepSignedIn: boolean,
  ) => Promise<RegisterResult>;
  signIn: (
    email: string,
    password: string,
    keepSignedIn: boolean,
  ) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  /** Re-fetch token payload so flags like identityVerified update after staff KYC. */
  refreshSession: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setBootStage('auth_hydrate_start');

    const finish = () => {
      if (mounted) {
        setIsLoading(false);
        setBootStage('auth_hydrate_done');
      }
    };

    const timeout = setTimeout(() => {
      if (!mounted) {
        return;
      }
      console.warn('[auth] hydrate timed out — releasing splash wait');
      void recordBootError('auth_hydrate_timeout', 'Auth hydrate exceeded timeout', {
        persist: false,
      });
      finish();
    }, AUTH_BOOT_TIMEOUT_MS);

    (async () => {
      try {
        const session = await loadSession();
        if (!mounted) {
          return;
        }
        setBootStage('auth_session_loaded');

        if (session?.user) {
          // Honor "Keep me signed in" — ephemeral sessions are not restored.
          if (session.keepSignedIn === false) {
            await clearSession();
            if (mounted) {
              setUser(null);
            }
            return;
          }

          if (session.refreshToken) {
            setBootStage('auth_refresh');
            try {
              const refreshed = await api.refreshSession();
              if (mounted && refreshed?.user) {
                setUser(refreshed.user);
                await saveSession({
                  ...session,
                  ...refreshed,
                  keepSignedIn: true,
                  user: refreshed.user,
                });
                // Push is deferred until after splash — see RootNavigator.
                return;
              }
              // Refresh returned null (expired/revoked). Clear so boot does not
              // keep a dead Bearer token that 401s profile hydrate.
              await clearSession();
              if (mounted) {
                setUser(null);
              }
              return;
            } catch (error) {
              // Dead refresh (400 Invalid refresh token / 401) → sign out.
              // Only keep a cached session for true offline / network failures.
              const status =
                error && typeof error === 'object' && 'response' in error
                  ? (error as { response?: { status?: number } }).response?.status
                  : undefined;
              const message = api.getApiErrorMessage(error);
              const deadRefresh =
                status === 401 ||
                status === 403 ||
                (status === 400 && /invalid refresh|refresh token/i.test(message));
              if (deadRefresh) {
                console.warn('[auth] refresh rejected — clearing session', message);
                await clearSession();
                if (mounted) {
                  setUser(null);
                }
                return;
              }
              console.warn('[auth] refresh failed, using cached session', error);
            }
          } else if (!session.token) {
            await clearSession();
            if (mounted) {
              setUser(null);
            }
            return;
          }
          if (mounted) {
            setUser(session.user);
          }
        }
      } catch (error) {
        await recordBootError('auth_hydrate', error);
        try {
          await clearSession();
        } catch {
          // ignore
        }
        if (mounted) {
          setUser(null);
        }
      } finally {
        clearTimeout(timeout);
        finish();
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const persistSession = useCallback(async (session: AuthSession) => {
    if (session.keepSignedIn === false) {
      await clearSession();
    } else {
      await saveSession({ ...session, keepSignedIn: true });
    }
    setUser(session.user);
    setAuthError(null);
    if (session.user.notificationsEnabled !== false) {
      void registerPushTokenIfAvailable();
    }
  }, []);

  const register = useCallback(
    async (
      displayName: string,
      email: string,
      password: string,
      _keepSignedIn: boolean,
    ) => {
      try {
        const result = await api.register(displayName, email, password);
        setAuthError(null);
        return result;
      } catch (error) {
        const message = api.getApiErrorMessage(error);
        setAuthError(message);
        throw new Error(message);
      }
    },
    [],
  );

  const signIn = useCallback(
    async (email: string, password: string, keepSignedIn: boolean) => {
      try {
        const session = await api.login(email, password);
        await persistSession({ ...session, keepSignedIn });
        return session.user;
      } catch (error) {
        const message = api.getApiErrorMessage(error);
        setAuthError(message);
        throw new Error(message);
      }
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    try {
      const session = await loadSession();
      await api.logout(session?.refreshToken);
    } catch (error) {
      console.warn('[auth] logout API failed', error);
    }
    try {
      await clearSession();
    } catch (error) {
      console.warn('[auth] clearSession failed', error);
    }
    setUser(null);
    setAuthError(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const refreshed = await api.refreshSession();
      if (refreshed?.user) {
        setUser(refreshed.user);
        return refreshed.user;
      }
      return null;
    } catch (error) {
      console.warn('[auth] refreshSession failed', error);
      return null;
    }
  }, []);

  // Pick up staff KYC / suspension changes without forcing a full re-login.
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const wasBackground = appState.current.match(/inactive|background/);
      appState.current = next;
      if (wasBackground && next === 'active' && user) {
        void refreshSession();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [user, refreshSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      register,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, isLoading, authError, register, signIn, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

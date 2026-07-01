import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthSession, AuthUser } from '../types/auth';
import {
  clearSession,
  loadSession,
  saveSession,
} from '../services/authStorage';
import * as api from '../services/api';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  register: (
    displayName: string,
    email: string,
    password: string,
    keepSignedIn: boolean,
  ) => Promise<void>;
  signIn: (
    email: string,
    password: string,
    keepSignedIn: boolean,
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await loadSession();
      if (mounted && session?.user) {
        setUser(session.user);
      }
      if (mounted) {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = useCallback(async (session: AuthSession) => {
    await saveSession(session);
    setUser(session.user);
    setAuthError(null);
  }, []);

  const register = useCallback(
    async (
      displayName: string,
      email: string,
      password: string,
      keepSignedIn: boolean,
    ) => {
      try {
        const session = await api.register(displayName, email, password);
        await persistSession({ ...session, keepSignedIn });
      } catch (error) {
        const message = api.getApiErrorMessage(error);
        setAuthError(message);
        throw new Error(message);
      }
    },
    [persistSession],
  );

  const signIn = useCallback(
    async (email: string, password: string, keepSignedIn: boolean) => {
      try {
        const session = await api.login(email, password);
        await persistSession({ ...session, keepSignedIn });
        return true;
      } catch {
        return false;
      }
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    const session = await loadSession();
    await api.logout(session?.refreshToken);
    await clearSession();
    setUser(null);
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      register,
      signIn,
      signOut,
    }),
    [user, isLoading, authError, register, signIn, signOut],
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

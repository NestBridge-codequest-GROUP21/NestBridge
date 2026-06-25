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
  loadCredentials,
  loadSession,
  saveCredentials,
  saveSession,
} from '../services/authStorage';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
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

function createMockToken(userId: string): string {
  return `mock-jwt-${userId}-${Date.now()}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const register = useCallback(
    async (
      displayName: string,
      email: string,
      password: string,
      keepSignedIn: boolean,
    ) => {
      const normalizedEmail = email.trim().toLowerCase();
      const credentials = await loadCredentials();
      const existing = credentials.find((entry) => entry.email === normalizedEmail);
      if (existing) {
        throw new Error('An account with this email already exists.');
      }

      const userId = `user-${Date.now()}`;
      const nextUser: AuthUser = {
        userId,
        email: normalizedEmail,
        displayName: displayName.trim(),
      };

      await saveCredentials([
        ...credentials,
        {
          userId,
          email: normalizedEmail,
          displayName: displayName.trim(),
          password,
        },
      ]);

      await persistSession({
        token: createMockToken(userId),
        user: nextUser,
        keepSignedIn,
      });
    },
    [persistSession],
  );

  const signIn = useCallback(
    async (email: string, password: string, keepSignedIn: boolean) => {
      const normalizedEmail = email.trim().toLowerCase();
      const credentials = await loadCredentials();
      const match = credentials.find(
        (entry) => entry.email === normalizedEmail && entry.password === password,
      );
      if (!match) {
        return false;
      }

      await persistSession({
        token: createMockToken(match.userId),
        user: {
          userId: match.userId,
          email: match.email,
          displayName: match.displayName,
        },
        keepSignedIn,
      });
      return true;
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      register,
      signIn,
      signOut,
    }),
    [user, isLoading, register, signIn, signOut],
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

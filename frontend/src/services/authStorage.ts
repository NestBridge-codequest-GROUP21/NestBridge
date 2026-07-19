import * as SecureStore from 'expo-secure-store';
import type { AuthSession, StoredCredential } from '../types/auth';

const SESSION_KEY = 'nestbridge_session';
const CREDENTIALS_KEY = 'nestbridge_credentials';

/** Reject truncated / non-object JSON left in SecureStore so hydrate cannot crash. */
export function isValidSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const session = value as Partial<AuthSession>;
  const user = session.user;
  if (!user || typeof user !== 'object') {
    return false;
  }
  return (
    typeof session.token === 'string' &&
    session.token.length > 0 &&
    typeof user.userId === 'string' &&
    user.userId.length > 0 &&
    typeof user.email === 'string' &&
    typeof user.displayName === 'string'
  );
}

export async function loadSession(): Promise<AuthSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) {
      return null;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn('[authStorage] session JSON corrupt — clearing');
      await clearSession();
      return null;
    }
    if (!isValidSession(parsed)) {
      console.warn('[authStorage] session shape invalid — clearing');
      await clearSession();
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('[authStorage] loadSession failed', error);
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  if (!isValidSession(session)) {
    console.warn('[authStorage] refuse to save invalid session');
    return;
  }
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('[authStorage] saveSession failed', error);
  }
}

export async function clearSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.warn('[authStorage] clearSession failed', error);
  }
}

export async function loadCredentials(): Promise<StoredCredential[]> {
  try {
    const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredCredential[]) : [];
  } catch {
    return [];
  }
}

export async function saveCredentials(credentials: StoredCredential[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.warn('[authStorage] saveCredentials failed', error);
  }
}

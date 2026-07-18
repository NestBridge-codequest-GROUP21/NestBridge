import * as SecureStore from 'expo-secure-store';
import type { AuthSession, StoredCredential } from '../types/auth';

const SESSION_KEY = 'nestbridge_session';
const CREDENTIALS_KEY = 'nestbridge_credentials';

export async function loadSession(): Promise<AuthSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
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
    return JSON.parse(raw) as StoredCredential[];
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

import * as SecureStore from 'expo-secure-store';
import type { AuthSession, StoredCredential } from '../types/auth';

const SESSION_KEY = 'nestbridge_session';
const CREDENTIALS_KEY = 'nestbridge_credentials';

export async function loadSession(): Promise<AuthSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function loadCredentials(): Promise<StoredCredential[]> {
  const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as StoredCredential[];
  } catch {
    return [];
  }
}

export async function saveCredentials(credentials: StoredCredential[]): Promise<void> {
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
}

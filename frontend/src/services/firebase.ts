import Constants from 'expo-constants';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  off,
  type Database,
} from 'firebase/database';
import type { ChatMessage } from '../types/messaging';

function readExtra(key: string): string {
  try {
    const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;
    const value = extra?.[key];
    return typeof value === 'string' ? value.trim() : '';
  } catch {
    return '';
  }
}

let app: FirebaseApp | null = null;
let database: Database | null = null;
let initAttempted = false;
let initFailed = false;

function firebaseConfig() {
  return {
    apiKey: readExtra('firebaseApiKey'),
    authDomain: readExtra('firebaseAuthDomain'),
    databaseURL: readExtra('firebaseDatabaseUrl'),
    projectId: readExtra('firebaseProjectId'),
  };
}

/** True only when enough Firebase config exists to attempt Realtime Database. */
export function isFirebaseConfigured(): boolean {
  if (initFailed) {
    return false;
  }
  const config = firebaseConfig();
  return (
    config.apiKey.length > 0 &&
    config.databaseURL.length > 0 &&
    config.projectId.length > 0
  );
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (app) {
    return app;
  }
  if (initAttempted && initFailed) {
    return null;
  }

  initAttempted = true;
  try {
    const config = firebaseConfig();
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
    database = getDatabase(app);
    initFailed = false;
    return app;
  } catch (error) {
    console.warn('[firebase] init skipped — config missing or invalid', error);
    app = null;
    database = null;
    initFailed = true;
    return null;
  }
}

export function subscribeToMessages(
  firebasePath: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
): () => void {
  try {
    const fbApp = getFirebaseApp();
    if (!fbApp || !firebasePath) {
      return () => undefined;
    }
    const db = database ?? getDatabase(fbApp);
    const messagesRef = ref(db, `${firebasePath}/messages`);
    const handler = (snapshot: {
      val: () => Record<string, { senderId?: string; text?: string; sentAt?: string }> | null;
    }) => {
      try {
        const value = snapshot.val();
        if (!value) {
          onMessages([]);
          return;
        }
        const parsed: ChatMessage[] = Object.entries(value)
          .map(([id, payload]) => ({
            id,
            senderId: payload.senderId ?? '',
            text: payload.text ?? '',
            sentAt: payload.sentAt ?? new Date().toISOString(),
            isOwn: payload.senderId === currentUserId,
          }))
          .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
        onMessages(parsed);
      } catch (error) {
        console.warn('[firebase] message parse failed', error);
        onMessages([]);
      }
    };
    onValue(messagesRef, handler);
    return () => {
      try {
        off(messagesRef, 'value', handler as never);
      } catch {
        // ignore unsubscribe failures
      }
    };
  } catch (error) {
    console.warn('[firebase] subscribe failed', error);
    return () => undefined;
  }
}

export async function sendFirebaseMessage(
  firebasePath: string,
  senderId: string,
  text: string,
): Promise<void> {
  try {
    const fbApp = getFirebaseApp();
    if (!fbApp || !firebasePath) {
      return;
    }
    const db = database ?? getDatabase(fbApp);
    const messagesRef = ref(db, `${firebasePath}/messages`);
    await push(messagesRef, {
      senderId,
      text,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('[firebase] send failed', error);
  }
}

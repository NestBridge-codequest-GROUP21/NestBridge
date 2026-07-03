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
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;
  return extra?.[key]?.trim() ?? '';
}

let app: FirebaseApp | null = null;
let database: Database | null = null;

export function isFirebaseConfigured(): boolean {
  return readExtra('firebaseDatabaseUrl').length > 0;
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (app) {
    return app;
  }
  const config = {
    apiKey: readExtra('firebaseApiKey'),
    authDomain: readExtra('firebaseAuthDomain'),
    databaseURL: readExtra('firebaseDatabaseUrl'),
    projectId: readExtra('firebaseProjectId'),
  };
  app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
  database = getDatabase(app);
  return app;
}

export function subscribeToMessages(
  firebasePath: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
): () => void {
  const fbApp = getFirebaseApp();
  if (!fbApp || !firebasePath) {
    return () => undefined;
  }
  const db = database ?? getDatabase(fbApp);
  const messagesRef = ref(db, `${firebasePath}/messages`);
  const handler = (snapshot: { val: () => Record<string, { senderId?: string; text?: string; sentAt?: string }> | null }) => {
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
  };
  onValue(messagesRef, handler);
  return () => {
    off(messagesRef, 'value', handler as never);
  };
}

export async function sendFirebaseMessage(
  firebasePath: string,
  senderId: string,
  text: string,
): Promise<void> {
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
}

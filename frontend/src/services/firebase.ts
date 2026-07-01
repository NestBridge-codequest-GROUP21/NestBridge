/**
 * Firebase Realtime Database chat helpers.
 * Requires backend POST /api/conversations to provision firebasePath.
 * Set EXPO_PUBLIC_FIREBASE_DATABASE_URL when wiring a real Firebase project.
 */

import { createConversation, type ConversationApi } from './api';

const FIREBASE_DATABASE_URL =
  process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ?? '';

export function isFirebaseConfigured(): boolean {
  return FIREBASE_DATABASE_URL.length > 0;
}

export async function openConversation(participantId: string): Promise<ConversationApi> {
  return createConversation(participantId);
}

export function conversationMessagesUrl(firebasePath: string): string {
  if (!isFirebaseConfigured()) {
    return '';
  }
  const base = FIREBASE_DATABASE_URL.replace(/\/$/, '');
  return `${base}/${firebasePath}/messages.json`;
}

/** Placeholder until Firebase SDK listener is added in a follow-up pass. */
export function subscribeToMessages(
  _firebasePath: string,
  _onMessage: (payload: unknown) => void,
): () => void {
  return () => undefined;
}

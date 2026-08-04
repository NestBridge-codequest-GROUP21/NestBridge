import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import {
  getConversationMessages,
  sendConversationMessage,
  getApiErrorMessage,
} from '../services/api';
import { messagesForConversation } from '../data/conversationsMock';
import {
  isFirebaseConfigured,
  subscribeToMessages,
} from '../services/firebase';
import type { ChatMessage } from '../types/messaging';
import { shouldUseDemoFallbackForAccount } from '../config/demoMode';
import { useAuth } from '../context/AuthContext';

/** REST poll when Firebase is unavailable (source of truth fallback). */
const REST_POLL_MS = 1500;
/** Slow REST safety net while Firebase is live — avoids 1.5s network churn. */
const REST_POLL_WITH_FIREBASE_MS = 12000;

function mapApiMessages(
  items: Array<{ messageId: string; senderId: string; text: string; sentAt: string }>,
  currentUserId: string,
): ChatMessage[] {
  return items.map((item) => ({
    id: item.messageId,
    senderId: item.senderId,
    text: item.text,
    sentAt: item.sentAt,
    isOwn: item.senderId === currentUserId,
  }));
}

/** Merge by message id; prefer newer/longer list order by sentAt. */
function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map<string, ChatMessage>();
  for (const message of existing) {
    byId.set(message.id, message);
  }
  for (const message of incoming) {
    byId.set(message.id, message);
  }
  return Array.from(byId.values()).sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export function useChatMessages(
  conversationId: string | undefined,
  firebasePath: string | undefined,
  currentUserId: string | undefined,
): {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
} {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const loadRestMessages = useCallback(async () => {
    if (!conversationId || !currentUserId) {
      return;
    }
    const items = await getConversationMessages(conversationId);
    if (items.length > 0) {
      setMessages((prev) => mergeMessages(prev, mapApiMessages(items, currentUserId)));
      return;
    }

    // Keep any optimistic/local rows; only seed demo when the thread is empty.
    if (messagesRef.current.length > 0) {
      return;
    }

    if (!shouldUseDemoFallbackForAccount(user?.email)) {
      setMessages([]);
      return;
    }

    const demoMessages = messagesForConversation(conversationId);
    if (demoMessages.length > 0) {
      setMessages(
        demoMessages.map((item) => ({
          ...item,
          senderId: item.senderId === 'self' ? currentUserId : item.senderId,
          isOwn: item.senderId === 'self' || item.senderId === currentUserId,
        })),
      );
    } else {
      setMessages([]);
    }
  }, [conversationId, currentUserId, user?.email]);

  useEffect(() => {
    if (!conversationId || !currentUserId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    let unsubscribeFirebase: (() => void) | undefined;
    const firebaseLive = isFirebaseConfigured() && Boolean(firebasePath);

    const clearPoll = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const startPoll = () => {
      clearPoll();
      if (AppState.currentState !== 'active') {
        return;
      }
      const intervalMs = firebaseLive ? REST_POLL_WITH_FIREBASE_MS : REST_POLL_MS;
      pollRef.current = setInterval(() => {
        void loadRestMessages().catch(() => undefined);
      }, intervalMs);
    };

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        await loadRestMessages();
        if (cancelled) return;

        // Firebase carries live updates; REST poll is a slow backup (or fast if offline).
        startPoll();

        // Optional realtime boost: merge Firebase pushes without wiping REST history.
        // Backend already writes to Firebase; client must NOT double-write.
        if (firebaseLive && firebasePath) {
          unsubscribeFirebase = subscribeToMessages(
            firebasePath,
            currentUserId,
            (firebaseMessages) => {
              if (firebaseMessages.length === 0) {
                return;
              }
              setMessages((prev) => mergeMessages(prev, firebaseMessages));
            },
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void loadRestMessages().catch(() => undefined);
        startPoll();
      } else {
        clearPoll();
      }
    });

    return () => {
      cancelled = true;
      appStateSub.remove();
      if (unsubscribeFirebase) {
        unsubscribeFirebase();
      }
      clearPoll();
    };
  }, [conversationId, firebasePath, currentUserId, loadRestMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId || !currentUserId) {
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      setError(null);

      const optimisticId = `local-${Date.now()}`;
      const optimistic: ChatMessage = {
        id: optimisticId,
        senderId: currentUserId,
        text: trimmed,
        sentAt: new Date().toISOString(),
        isOwn: true,
      };
      setMessages((prev) => mergeMessages(prev, [optimistic]));

      try {
        // Persist via API. Backend also pushes to Firebase when enabled —
        // do not write again from the client (avoids duplicate messages).
        const saved = await sendConversationMessage(conversationId, trimmed);
        const mapped = mapApiMessages([saved], currentUserId)[0]!;
        setMessages((prev) => {
          const withoutOptimistic = prev.filter((message) => message.id !== optimisticId);
          return mergeMessages(withoutOptimistic, [mapped]);
        });
      } catch (err) {
        setMessages((prev) => prev.filter((message) => message.id !== optimisticId));
        setError(getApiErrorMessage(err));
        throw err;
      }
    },
    [conversationId, currentUserId],
  );

  return { messages, isLoading, error, sendMessage };
}

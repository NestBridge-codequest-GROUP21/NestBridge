import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getConversationMessages,
  sendConversationMessage,
  getApiErrorMessage,
} from '../services/api';
import { messagesForConversation } from '../data/conversationsMock';
import {
  isFirebaseConfigured,
  sendFirebaseMessage,
  subscribeToMessages,
} from '../services/firebase';
import type { ChatMessage } from '../types/messaging';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadRestMessages = useCallback(async () => {
    if (!conversationId || !currentUserId) {
      return;
    }
    const items = await getConversationMessages(conversationId);
    if (items.length > 0) {
      setMessages(
        items.map((item) => ({
          id: item.messageId,
          senderId: item.senderId,
          text: item.text,
          sentAt: item.sentAt,
          isOwn: item.senderId === currentUserId,
        })),
      );
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
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (!conversationId || !currentUserId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    let unsubscribeFirebase: (() => void) | undefined;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        await loadRestMessages();
        if (cancelled) return;

        if (isFirebaseConfigured() && firebasePath) {
          unsubscribeFirebase = subscribeToMessages(
            firebasePath,
            currentUserId,
            setMessages,
          );
        } else {
          pollRef.current = setInterval(() => {
            void loadRestMessages().catch(() => undefined);
          }, 4000);
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

    return () => {
      cancelled = true;
      if (unsubscribeFirebase) {
        unsubscribeFirebase();
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
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
      try {
        const saved = await sendConversationMessage(conversationId, trimmed);
        const mapped: ChatMessage = {
          id: saved.messageId,
          senderId: saved.senderId,
          text: saved.text,
          sentAt: saved.sentAt,
          isOwn: saved.senderId === currentUserId,
        };
        if (isFirebaseConfigured() && firebasePath) {
          await sendFirebaseMessage(firebasePath, currentUserId, trimmed);
        } else {
          setMessages((prev) => [...prev, mapped]);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
        throw err;
      }
    },
    [conversationId, currentUserId, firebasePath],
  );

  return { messages, isLoading, error, sendMessage };
}

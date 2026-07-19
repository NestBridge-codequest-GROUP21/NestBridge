import { useCallback, useEffect, useState } from 'react';
import {
  listConversations,
  getApiErrorMessage,
  type ConversationListApi,
} from '../services/api';
import type { ConversationListItem } from '../types/messaging';

function mapConversation(item: ConversationListApi): ConversationListItem {
  return {
    id: item.conversationId,
    participantId: item.participantId,
    participantName: item.participantName,
    participantInitials: item.participantInitials,
    participantRole: item.participantRole as ConversationListItem['participantRole'],
    lastMessage: item.lastMessage,
    lastMessageAt: item.lastMessageAt,
    unreadCount: item.unreadCount,
    firebasePath: item.firebasePath,
  };
}

export interface ConversationsState {
  conversations: ConversationListItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  upsertConversation: (item: ConversationListItem) => void;
}

export function useConversations(userId: string | undefined): ConversationsState {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const upsertConversation = useCallback((item: ConversationListItem) => {
    setConversations((prev) => {
      const existing = prev.filter((entry) => entry.id !== item.id);
      return [item, ...existing];
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const items = await listConversations();
        if (!cancelled) {
          setConversations(items.map(mapConversation));
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setConversations([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, tick]);

  return { conversations, isLoading, error, refresh, upsertConversation };
}

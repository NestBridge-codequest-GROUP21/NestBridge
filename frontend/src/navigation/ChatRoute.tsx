import { useThemedStyles, type AppTheme } from '../theme';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ChatScreen from '../screens/shared/ChatScreen';
import { useChatMessages } from '../hooks/useChatMessages';
import type { ConversationListItem } from '../types/messaging';
import { getApiErrorMessage, getConversation } from '../services/api';
import {
  fontSizes,
  spacing,
} from '../constants/theme';
import { useTheme } from '../theme';

export interface ChatRouteProps {
  conversationId: string;
  conversation?: ConversationListItem | null;
  currentUserId: string;
  onBack?: () => void;
  onMessageSent?: () => void;
  onParticipantPress?: (conversation: ConversationListItem) => void;
}

function mapListed(item: {
  conversationId: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantRole: string;
  firebasePath: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}): ConversationListItem {
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

export default function ChatRoute({
  conversationId,
  conversation: initialConversation,
  currentUserId,
  onBack,
  onMessageSent,
  onParticipantPress,
}: ChatRouteProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<ConversationListItem | null>(
    initialConversation ?? null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(!initialConversation);

  useEffect(() => {
    if (initialConversation) {
      setConversation(initialConversation);
      setLoadingConversation(false);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingConversation(true);
      setLoadError(null);
      try {
        const remote = await getConversation(conversationId);
        if (!cancelled) {
          setConversation(mapListed(remote));
        }
      } catch (error) {
        if (!cancelled) {
          setConversation(null);
          setLoadError(getApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingConversation(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, initialConversation]);

  const chat = useChatMessages(
    conversation?.id ?? conversationId,
    conversation?.firebasePath,
    currentUserId,
  );

  if (loadingConversation) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Text style={styles.missingTitle}>Conversation not found</Text>
        <Text style={styles.missingBody}>
          {loadError ?? 'This chat may have been removed or is no longer available.'}
        </Text>
        {onBack ? (
          <Text style={styles.backLink} onPress={onBack} accessibilityRole="button">
            Go back
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {chat.error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{chat.error}</Text>
        </View>
      ) : null}
      <ChatScreen
        participantName={conversation.participantName}
        participantInitials={conversation.participantInitials}
        participantRole={conversation.participantRole}
        verification={conversation.verification}
        rating={conversation.rating}
        ratingCount={conversation.ratingCount}
        bookingContext={conversation.bookingContext}
        messages={chat.messages}
        isLoading={chat.isLoading}
        isSending={isSending}
        onBack={onBack}
        onParticipantPress={
          onParticipantPress ? () => onParticipantPress(conversation) : undefined
        }
        onSendMessage={async (text) => {
          setIsSending(true);
          try {
            await chat.sendMessage(text);
            onMessageSent?.();
          } finally {
            setIsSending(false);
          }
        }}
      />
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: { flex: 1 },
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    missingTitle: {
      color: colors.textPrimary,
      fontSize: fontSizes.subheading,
      textAlign: 'center',
    },
    missingBody: {
      color: colors.textSecondary,
      fontSize: fontSizes.body,
      textAlign: 'center',
    },
    backLink: {
      marginTop: spacing.md,
      color: colors.teal,
      fontSize: fontSizes.body,
    },
    errorBanner: {
      backgroundColor: colors.danger,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    errorText: {
      color: colors.onPrimary,
      fontSize: fontSizes.caption,
    },
  });
}

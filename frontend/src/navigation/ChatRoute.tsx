import { useThemedStyles, type AppTheme } from '../theme';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ChatScreen from '../screens/shared/ChatScreen';
import { useChatMessages } from '../hooks/useChatMessages';
import type { ConversationListItem } from '../types/messaging';
import {
  fontSizes,
  spacing,
} from '../constants/theme';

export interface ChatRouteProps {
  conversation: ConversationListItem;
  currentUserId: string;
  onBack?: () => void;
  onMessageSent?: () => void;
  onParticipantPress?: () => void;
}

export default function ChatRoute({
  conversation,
  currentUserId,
  onBack,
  onMessageSent,
  onParticipantPress,
}: ChatRouteProps) {
  const styles = useThemedStyles(createStyles);
  const [isSending, setIsSending] = useState(false);

  const chat = useChatMessages(
    conversation.id,
    conversation.firebasePath,
    currentUserId,
  );

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
        onParticipantPress={onParticipantPress}
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

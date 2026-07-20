import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
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
}

export default function ChatRoute({
  conversation,
  currentUserId,
  onBack,
  onMessageSent,
}: ChatRouteProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const chat = useChatMessages(conversation.id, conversation.firebasePath, currentUserId);

  if (chat.isLoading && chat.messages.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
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
        messages={chat.messages}
        onBack={onBack}
        onSendMessage={(text) => {
          void chat.sendMessage(text).then(() => onMessageSent?.());
        }}
      />
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorBanner: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.white,
    fontSize: fontSizes.caption,
  },
});
}


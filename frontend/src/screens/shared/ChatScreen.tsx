import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../../constants/theme';
import type { ChatMessage } from '../../types/messaging';

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export interface ChatScreenProps {
  participantName: string;
  participantInitials: string;
  messages: ChatMessage[];
  onBack?: () => void;
  onSendMessage?: (text: string) => void;
}

export default function ChatScreen({
  participantName,
  participantInitials,
  messages: initialMessages,
  onBack,
  onSendMessage,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: 'self',
      text: trimmed,
      sentAt: new Date().toISOString(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
    onSendMessage?.(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{participantInitials}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{participantName}</Text>
          <Text style={styles.headerSubtitle}>Direct message</Text>
        </View>
      </View>

      <ScrollView
        style={styles.messagesScroll}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.bubbleWrap,
              message.isOwn ? styles.bubbleWrapOwn : styles.bubbleWrapOther,
            ]}
          >
            <View
              style={[
                styles.bubble,
                message.isOwn ? styles.bubbleOwn : styles.bubbleOther,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  message.isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther,
                ]}
              >
                {message.text}
              </Text>
            </View>
            <Text style={styles.timestamp}>{formatMessageTime(message.sentAt)}</Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.composer,
          { paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message…"
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (!draft.trim() || pressed) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!draft.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendLabel}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 44,
  },
  backIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.white,
    opacity: 0.8,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  bubbleWrap: {
    marginBottom: spacing.md,
    maxWidth: '82%',
  },
  bubbleWrapOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleOwn: {
    backgroundColor: colors.teal,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
  },
  bubbleTextOwn: {
    color: colors.white,
  },
  bubbleTextOther: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  sendButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});

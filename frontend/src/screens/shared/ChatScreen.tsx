import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
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
import BackButton from '../../components/BackButton';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  iconSizes,
  touchTarget,
  lineHeights,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


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
          <BackButton onPress={onBack} color={colors.white} />
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Avatar initials={participantInitials} size="md" highlighted />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{participantName}</Text>
          <Text style={styles.headerSubtitle}>NestBridge message</Text>
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
        {messages.length === 0 ? (
          <EmptyState
            title="Start the conversation"
            body={`Say hello to ${participantName}. Clear plans help hosts and guides prepare for your stay.`}
            tip="Share arrival times, dietary needs, or questions about Accra."
            iconName="chatbubble-ellipses-outline"
            carded={false}
          />
        ) : null}
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
          placeholder="Write a message…"
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
          <AppIcon name="send" size={iconSizes.md} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
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
  backPlaceholder: {
    width: touchTarget,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.body,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
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
    ...shadows.card,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    ...shadows.card,
  },
  bubbleText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
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
    lineHeight: lineHeights.caption,
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
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: controlHeights.md,
    maxHeight: controlHeights.lg + spacing.xxl,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  sendButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
}


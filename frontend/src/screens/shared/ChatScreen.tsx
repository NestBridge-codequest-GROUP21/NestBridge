import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import StatusBadge, { type StatusBadgeTone } from '../../components/StatusBadge';
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
import type {
  ChatMessage,
  ConversationBookingContext,
  ConversationParticipantRole,
} from '../../types/messaging';
import type { ProviderVerification } from '../../types/verification';
import { normalizeVerification } from '../../types/verification';
import { emptyStates } from '../../data/appCopy';

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function roleLabel(role: ConversationParticipantRole): string {
  switch (role) {
    case 'host':
      return 'Host';
    case 'guide':
      return 'Guide';
    default:
      return 'Guest';
  }
}

function verifiedLine(
  role: ConversationParticipantRole,
  verification?: ProviderVerification,
): string | null {
  if (role !== 'host' && role !== 'guide') {
    return null;
  }
  const flags = normalizeVerification(verification);
  if (!flags.providerVerified) {
    return null;
  }
  return role === 'host' ? 'Verified Host' : 'Verified Local Guide';
}

export interface ChatScreenProps {
  participantName: string;
  participantInitials: string;
  participantRole?: ConversationParticipantRole;
  verification?: ProviderVerification;
  rating?: number;
  ratingCount?: number;
  bookingContext?: ConversationBookingContext;
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
  onBack?: () => void;
  onSendMessage?: (text: string) => void | Promise<void>;
  onParticipantPress?: () => void;
}

export default function ChatScreen({
  participantName,
  participantInitials,
  participantRole = 'guest',
  verification,
  rating,
  ratingCount,
  bookingContext,
  messages: incomingMessages,
  isLoading = false,
  isSending = false,
  onBack,
  onSendMessage,
  onParticipantPress,
}: ChatScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.chatThread(participantName);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState(incomingMessages);
  const [draft, setDraft] = useState('');
  const verified = verifiedLine(participantRole, verification);

  useEffect(() => {
    setMessages(incomingMessages);
  }, [incomingMessages]);

  useEffect(() => {
    if (isSending) {
      return;
    }
    setMessages((prev) =>
      prev.map((message) =>
        message.isOwn && message.status === 'sending'
          ? { ...message, status: 'sent' }
          : message,
      ),
    );
  }, [isSending]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length, isSending]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || isSending) {
      return;
    }

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: 'self',
      text: trimmed,
      sentAt: new Date().toISOString(),
      isOwn: true,
      status: 'sending',
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
    void Promise.resolve(onSendMessage?.(trimmed));
  };

  const subtitleParts = [
    verified ?? roleLabel(participantRole),
    rating != null
      ? `★ ${rating.toFixed(1)}${ratingCount != null ? ` (${ratingCount})` : ''}`
      : null,
  ].filter(Boolean);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {onBack ? (
          <BackButton onPress={onBack} color={colors.onPrimary} />
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Pressable
          style={({ pressed }) => [
            styles.headerProfile,
            pressed && styles.pressed,
          ]}
          onPress={onParticipantPress}
          disabled={!onParticipantPress}
          accessibilityRole={onParticipantPress ? 'button' : undefined}
          accessibilityLabel={
            onParticipantPress
              ? `View ${participantName} profile`
              : participantName
          }
        >
          <Avatar initials={participantInitials} size="md" highlighted />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {participantName}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitleParts.join(' · ')}
            </Text>
          </View>
          {onParticipantPress ? (
            <AppIcon
              name="chevron-forward"
              size={iconSizes.md}
              color={colors.onPrimary}
            />
          ) : null}
        </Pressable>
      </View>

      {bookingContext ? (
        <Card style={styles.contextCard} padding="md" elevation="none">
          <View style={styles.contextTop}>
            <Text style={styles.contextEyebrow}>
              {bookingContext.kind === 'HOST_STAY' ? 'Booking' : 'Guide session'}
            </Text>
            <StatusBadge
              label={bookingContext.statusLabel}
              tone={bookingContext.statusTone as StatusBadgeTone}
            />
          </View>
          <Text style={styles.contextTitle}>{bookingContext.title}</Text>
          <Text style={styles.contextDetail}>
            {bookingContext.detailLabel}: {bookingContext.detailValue}
          </Text>
        </Card>
      ) : null}

      {isLoading && messages.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingLabel}>Loading conversation…</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <EmptyState
              title={empty.title}
              body={empty.body}
              tip={empty.tip}
              iconGlyph={empty.iconGlyph}
              carded={false}
            />
          ) : null}
          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const showMeta =
              !prev ||
              prev.isOwn !== message.isOwn ||
              Math.abs(
                new Date(message.sentAt).getTime() -
                  new Date(prev.sentAt).getTime(),
              ) > 5 * 60 * 1000;
            return (
              <View
                key={message.id}
                style={[
                  styles.bubbleWrap,
                  message.isOwn ? styles.bubbleWrapOwn : styles.bubbleWrapOther,
                  !showMeta && styles.bubbleWrapTight,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    message.isOwn ? styles.bubbleOwn : styles.bubbleOther,
                    !showMeta &&
                      (message.isOwn
                        ? styles.bubbleOwnStacked
                        : styles.bubbleOtherStacked),
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      message.isOwn
                        ? styles.bubbleTextOwn
                        : styles.bubbleTextOther,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                {showMeta ? (
                  <View style={styles.metaRow}>
                    <Text style={styles.timestamp}>
                      {formatMessageTime(message.sentAt)}
                    </Text>
                    {message.isOwn ? (
                      <Text style={styles.readState}>
                        {message.status === 'sending'
                          ? 'Sending…'
                          : message.status === 'read'
                            ? 'Read'
                            : 'Sent'}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}
          {isSending ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={colors.teal} />
              <Text style={styles.typingText}>Sending…</Text>
            </View>
          ) : null}
        </ScrollView>
      )}

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
          editable={!isSending}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (!draft.trim() || isSending || pressed) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!draft.trim() || isSending}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          {isSending ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <AppIcon name="send" size={iconSizes.md} color={colors.onPrimary} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles({ colors, shadows, tints }: AppTheme) {
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
      gap: spacing.sm,
    },
    backPlaceholder: {
      width: touchTarget,
    },
    headerProfile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: touchTarget,
    },
    pressed: {
      opacity: 0.9,
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.body,
      color: colors.onPrimary,
    },
    headerSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.onPrimary,
      opacity: 0.85,
    },
    contextCard: {
      marginHorizontal: layout.screenPaddingHorizontal,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      backgroundColor: tints.cream,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    contextTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    contextEyebrow: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    contextTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    contextDetail: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    loadingLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
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
    bubbleWrapTight: {
      marginBottom: spacing.xs,
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
      borderBottomRightRadius: borderRadius.sm,
      ...shadows.card,
    },
    bubbleOwnStacked: {
      borderTopRightRadius: borderRadius.sm,
    },
    bubbleOther: {
      backgroundColor: colors.surface,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      borderBottomLeftRadius: borderRadius.sm,
      ...shadows.card,
    },
    bubbleOtherStacked: {
      borderTopLeftRadius: borderRadius.sm,
    },
    bubbleText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
    },
    bubbleTextOwn: {
      color: colors.onPrimary,
    },
    bubbleTextOther: {
      color: colors.textPrimary,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    timestamp: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      lineHeight: lineHeights.micro,
      color: colors.textTertiary,
    },
    readState: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.teal,
    },
    typingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.sm,
      alignSelf: 'flex-end',
    },
    typingText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
    },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
      paddingHorizontal: layout.screenPaddingHorizontal,
      paddingTop: spacing.sm,
      backgroundColor: colors.surface,
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

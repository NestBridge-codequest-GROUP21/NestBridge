import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import AppIcon from '../../components/AppIcon';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
  lineHeights,
  iconSizes,
} from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { EmptyStateContent } from '../../data/appCopy';
import type { ConversationListItem } from '../../types/messaging';
import { normalizeVerification } from '../../types/verification';

function roleLabel(role: ConversationListItem['participantRole']): string {
  switch (role) {
    case 'host':
      return 'Host';
    case 'guide':
      return 'Guide';
    default:
      return 'Guest';
  }
}

function verifiedLabel(conversation: ConversationListItem): string | null {
  if (
    conversation.participantRole !== 'host' &&
    conversation.participantRole !== 'guide'
  ) {
    return null;
  }
  const flags = normalizeVerification(conversation.verification);
  if (!flags.providerVerified) {
    return null;
  }
  return conversation.participantRole === 'host'
    ? 'Verified Host'
    : 'Verified Local Guide';
}

export interface MessagesTabScreenProps {
  userName: string;
  userInitials: string;
  conversations: ConversationListItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyState: EmptyStateContent;
  onEmptyPrimaryAction?: () => void;
  onConversationPress?: (conversationId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export default function MessagesTabScreen({
  userName,
  userInitials,
  conversations,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  isLoading = false,
  errorMessage,
  emptyState,
  onEmptyPrimaryAction,
  onConversationPress,
  onTabPress,
}: MessagesTabScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Messages"
        userName={userName}
        userInitials={userInitials}
        subtitle="Hosts, guides, and guests in Ghana"
        compact
      />
      <ScreenScroll withTabBar withSosDock={showSosDock}>
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {isLoading ? (
          <View style={styles.skeletonWrap}>
            <SkeletonLoader />
            <SkeletonLoader style={styles.skeletonGap} />
          </View>
        ) : null}
        {!isLoading && conversations.length === 0 ? (
          <EmptyState
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
            iconGlyph={emptyState.iconGlyph ?? '💬'}
            primaryActionLabel={emptyState.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : null}
        {!isLoading
          ? conversations.map((conversation) => {
              const verified = verifiedLabel(conversation);
              const unread = conversation.unreadCount > 0;
              return (
                <Pressable
                  key={conversation.id}
                  style={({ pressed }) => [
                    styles.rowPress,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onConversationPress?.(conversation.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open chat with ${conversation.participantName}`}
                >
                  <Card
                    style={[styles.row, unread && styles.rowUnread]}
                    padding="md"
                    elevation="card"
                  >
                    <View style={styles.avatarWrap}>
                      <Avatar
                        initials={conversation.participantInitials}
                        size="lg"
                        highlighted={unread}
                      />
                      {unread ? <View style={styles.unreadDot} /> : null}
                    </View>
                    <View style={styles.body}>
                      <View style={styles.topRow}>
                        <Text style={styles.name} numberOfLines={1}>
                          {conversation.participantName}
                        </Text>
                        <Text style={[styles.time, unread && styles.timeUnread]}>
                          {formatRelativeTime(conversation.lastMessageAt)}
                        </Text>
                      </View>
                      <View style={styles.metaRow}>
                        {verified ? (
                          <View style={styles.verifiedChip}>
                            <AppIcon
                              name="checkmark-circle"
                              size={iconSizes.sm}
                              color={colors.success}
                            />
                            <Text style={styles.verifiedText}>{verified}</Text>
                          </View>
                        ) : (
                          <Text style={styles.roleText}>
                            {roleLabel(conversation.participantRole)}
                          </Text>
                        )}
                        {conversation.bookingContext ? (
                          <Text style={styles.contextHint} numberOfLines={1}>
                            · {conversation.bookingContext.title}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.bottomRow}>
                        <Text
                          style={[styles.preview, unread && styles.previewUnread]}
                          numberOfLines={1}
                        >
                          {conversation.lastMessage}
                        </Text>
                        {unread ? (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>
                              {conversation.unreadCount > 9
                                ? '9+'
                                : conversation.unreadCount}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })
          : null}
      </ScreenScroll>
      <AppTabBar
        items={tabBarItems}
        activeTabId={activeTabId}
        showSosDock={showSosDock}
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    skeletonWrap: {
      marginBottom: spacing.md,
    },
    skeletonGap: {
      marginTop: spacing.sm,
    },
    rowPress: {
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: touchTarget,
      gap: spacing.md,
    },
    rowUnread: {
      borderColor: colors.tealBright,
      borderWidth: borderWidths.hairline,
    },
    pressed: {
      opacity: 0.92,
    },
    avatarWrap: {
      position: 'relative',
    },
    unreadDot: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: spacing.sm,
      height: spacing.sm,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.tealBright,
      borderWidth: borderWidths.hairline,
      borderColor: colors.surface,
    },
    body: {
      flex: 1,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.xs,
    },
    name: {
      flex: 1,
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.body,
      color: colors.textPrimary,
    },
    time: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
    timeUnread: {
      color: colors.teal,
      fontFamily: fontFamilies.semibold,
      fontWeight: fontWeights.semibold,
    },
    verifiedChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: tints.teal,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.pill,
    },
    verifiedText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.onAccent,
    },
    roleText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textSecondary,
    },
    contextHint: {
      flex: 1,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textTertiary,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    preview: {
      flex: 1,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    previewUnread: {
      fontFamily: fontFamilies.semibold,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    unreadBadge: {
      minWidth: spacing.lg,
      height: spacing.lg,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.teal,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    unreadText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      lineHeight: lineHeights.micro,
      fontWeight: fontWeights.semibold,
      color: colors.onPrimary,
    },
  });
}

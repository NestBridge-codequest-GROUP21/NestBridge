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
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
  lineHeights,
} from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { ConversationListItem } from '../../types/messaging';

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
  emptyState: { title: string; body: string; tip?: string };
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
  onConversationPress,
  onTabPress,
}: MessagesTabScreenProps) {
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
            iconName="chatbubble-ellipses-outline"
          />
        ) : null}
        {!isLoading
          ? conversations.map((conversation) => (
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
                <Card style={styles.row}>
                  <Avatar
                    initials={conversation.participantInitials}
                    size="lg"
                    highlighted={conversation.unreadCount > 0}
                  />
                  <View style={styles.body}>
                    <View style={styles.topRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {conversation.participantName}
                      </Text>
                      <Text style={styles.time}>
                        {formatRelativeTime(conversation.lastMessageAt)}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <StatusBadge
                        label={roleLabel(conversation.participantRole)}
                        tone="info"
                      />
                    </View>
                    <View style={styles.bottomRow}>
                      <Text style={styles.preview} numberOfLines={1}>
                        {conversation.lastMessage}
                      </Text>
                      {conversation.unreadCount > 0 ? (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>
                            {conversation.unreadCount}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))
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

const styles = StyleSheet.create({
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
  pressed: {
    opacity: 0.92,
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
    marginBottom: spacing.xs,
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
  unreadBadge: {
    minWidth: spacing.lg,
    height: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: borderWidths.hairline,
    borderColor: colors.danger,
  },
  unreadText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.micro,
    lineHeight: lineHeights.micro,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});

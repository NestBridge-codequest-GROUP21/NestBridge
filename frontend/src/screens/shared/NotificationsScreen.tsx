import { useThemedStyles, type AppTheme } from '../../theme';
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
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  touchTarget,
  lineHeights,
} from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { emptyStates } from '../../data/appCopy';
import type { AppNotification } from '../../types/booking';

export interface NotificationsScreenProps {
  userName: string;
  userInitials: string;
  notifications: AppNotification[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onNotificationPress?: (notification: AppNotification) => void;
  onMarkAllRead?: () => void;
  onEmptyPrimaryAction?: () => void;
  onBack?: () => void;
}

export default function NotificationsScreen({
  userName,
  userInitials,
  notifications,
  isLoading = false,
  errorMessage,
  onNotificationPress,
  onMarkAllRead,
  onEmptyPrimaryAction,
  onBack,
}: NotificationsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const empty = emptyStates.notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Notifications"
        userName={userName}
        userInitials={userInitials}
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
            : 'You are all caught up'
        }
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}
        {unreadCount > 0 && onMarkAllRead ? (
          <SectionHeader
            title="Inbox"
            actionLabel="Mark all as read"
            onActionPress={onMarkAllRead}
          />
        ) : null}
        {isLoading ? (
          <View style={styles.skeletonWrap}>
            <SkeletonLoader />
            <SkeletonLoader style={styles.skeletonGap} />
          </View>
        ) : null}
        {!isLoading && notifications.length === 0 ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : null}
        {!isLoading
          ? notifications.map((notification) => (
              <Pressable
                key={notification.id}
                style={({ pressed }) => [
                  styles.cardPress,
                  pressed && styles.pressed,
                ]}
                onPress={() => onNotificationPress?.(notification)}
                accessibilityRole="button"
                accessibilityLabel={notification.title}
              >
                <Card
                  style={[
                    styles.card,
                    !notification.read && styles.cardUnread,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{notification.title}</Text>
                    {!notification.read ? (
                      <StatusBadge label="New" tone="info" />
                    ) : null}
                  </View>
                  <Text style={styles.cardBody}>{notification.body}</Text>
                  <Text style={styles.cardTime}>
                    {formatRelativeTime(notification.createdAt)}
                  </Text>
                </Card>
              </Pressable>
            ))
          : null}
      </ScreenScroll>
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
  cardPress: {
    marginBottom: spacing.sm,
    minHeight: touchTarget,
  },
  card: {},
  cardUnread: {
    backgroundColor: tints.teal,
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  cardBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
    marginBottom: spacing.sm,
  },
  cardTime: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
  pressed: {
    opacity: 0.9,
  },
});
}


import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  tints,
  shadows,
  lineHeights,
} from '../../constants/theme';
import type { AppNotification } from '../../types/booking';

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

export interface NotificationsScreenProps {
  userName: string;
  userInitials: string;
  notifications: AppNotification[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onNotificationPress?: (notification: AppNotification) => void;
  onMarkAllRead?: () => void;
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
  onBack,
}: NotificationsScreenProps) {
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
          <Pressable
            onPress={onMarkAllRead}
            style={({ pressed }) => [styles.markAll, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        ) : null}
        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}
        {!isLoading && notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            body="Booking updates, payment reminders, and host messages will appear here."
            tip="Keep notifications on so you do not miss check-in or session requests."
            iconName="notifications-outline"
          />
        ) : null}
        {notifications.map((notification, index) => (
          <Pressable
            key={notification.id}
            style={({ pressed }) => [
              styles.card,
              !notification.read && styles.cardUnread,
              index < notifications.length - 1 && styles.cardSpacing,
              pressed && styles.pressed,
            ]}
            onPress={() => onNotificationPress?.(notification)}
            accessibilityRole="button"
            accessibilityLabel={notification.title}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{notification.title}</Text>
              {!notification.read ? <View style={styles.unreadDot} /> : null}
            </View>
            <Text style={styles.cardBody}>{notification.body}</Text>
            <Text style={styles.cardTime}>{formatRelativeTime(notification.createdAt)}</Text>
          </Pressable>
        ))}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  markAll: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  markAllText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  cardUnread: {
    backgroundColor: tints.teal,
    borderColor: colors.teal,
  },
  cardSpacing: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    marginLeft: spacing.sm,
  },
  cardBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
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

import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StatusPill from './StatusPill';
import AppIcon from './AppIcon';
import type { AppStackParamList } from '../navigation/types';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  iconSizes,
  touchTarget,
  avatarSizes,
} from '../constants/theme';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  userName?: string;
  userInitials?: string;
  compact?: boolean;
  statusIcon?: string;
  statusLabel?: string;
  notificationCount?: number;
  onBack?: () => void;
  onHelpPress?: () => void;
  onNotificationPress?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  greeting,
  userName,
  userInitials,
  compact = false,
  statusIcon,
  statusLabel,
  notificationCount = 0,
  onBack,
  onHelpPress,
  onNotificationPress,
}: ScreenHeaderProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const showUserRow = Boolean(greeting || userName);
  const showTopActions = Boolean(onBack || onHelpPress);

  // Avoid showing the person's name twice (e.g. greeting "Good evening, Blessing"
  // above a large "Blessing"). Strip the name from the greeting line when it's
  // also rendered on its own below.
  const displayGreeting = React.useMemo(() => {
    if (!greeting || !userName) return greeting;
    if (!greeting.includes(userName)) return greeting;
    return greeting.replace(userName, '').replace(/[\s,]+$/, '').trim();
  }, [greeting, userName]);

  return (
    <LinearGradient
      colors={compact ? gradients.headerCompact : gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
    >
      {showTopActions ? (
        <View style={styles.topActions}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <AppIcon name="chevron-back" size={iconSizes.lg} color={colors.onPrimary} />
            </Pressable>
          ) : (
            <View style={styles.actionSpacer} />
          )}
          {onHelpPress ? (
            <Pressable
              onPress={onHelpPress}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Help"
            >
              <AppIcon name="help-circle-outline" size={iconSizes.lg} color={colors.onPrimary} />
            </Pressable>
          ) : (
            <View style={styles.actionSpacer} />
          )}
        </View>
      ) : null}

      {showUserRow ? (
        <>
          <View style={styles.userRow}>
            <View style={styles.userText}>
              {displayGreeting ? (
                <Text style={styles.greeting}>{displayGreeting}</Text>
              ) : null}
              {userName ? <Text style={styles.userName}>{userName}</Text> : null}
              {subtitle && !statusLabel ? (
                <Text style={styles.subtitleInline}>{subtitle}</Text>
              ) : null}
            </View>
            <View style={styles.headerActions}>
              {onNotificationPress ? (
                <Pressable
                  onPress={onNotificationPress}
                  style={styles.notificationButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    notificationCount > 0
                      ? `${notificationCount} notifications`
                      : 'Notifications'
                  }
                >
                  <AppIcon
                    name="notifications-outline"
                    size={iconSizes.md}
                    color={colors.onPrimary}
                  />
                  {notificationCount > 0 ? (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              ) : null}
              {userInitials ? (
                <Pressable
                  onPress={() => navigation.navigate('Profile')}
                  style={({ pressed }) => [
                    styles.avatar,
                    pressed && styles.avatarPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Open profile"
                  accessibilityHint="Opens your account and settings"
                  hitSlop={spacing.sm}
                >
                  <Text style={styles.avatarText}>{userInitials}</Text>
                  <View style={styles.avatarBadge}>
                    <AppIcon name="person" size={fontSizes.micro} color={colors.onPrimary} />
                  </View>
                </Pressable>
              ) : null}
            </View>
          </View>
          {statusLabel ? (
            <StatusPill icon={statusIcon} label={statusLabel} />
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.titleRow}>
            {onBack ? <View style={styles.actionSpacer} /> : null}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.actionSpacer} />
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </>
      )}
    </LinearGradient>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  actionButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSpacer: {
    width: touchTarget,
  },
  actionText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    color: colors.onPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
    fontWeight: fontWeights.bold,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.onPrimary,
    opacity: 0.88,
    marginTop: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  userText: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  greeting: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.onPrimary,
    opacity: 0.88,
    marginBottom: spacing.xs,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
    fontWeight: fontWeights.bold,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  subtitleInline: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.tealBright,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: fontSizes.subheading,
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    minWidth: 18,
    height: 18,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  notificationBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.micro,
    lineHeight: lineHeights.micro,
    color: colors.onPrimary,
  },
  avatar: {
    width: avatarSizes.lg,
    height: avatarSizes.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  avatarPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.navy,
  },
});
}


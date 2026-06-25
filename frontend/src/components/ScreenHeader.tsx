import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  lineHeights,
} from '../constants/theme';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  userName?: string;
  userInitials?: string;
  compact?: boolean;
  onBack?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  greeting,
  userName,
  userInitials,
  compact = false,
  onBack,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const showUserRow = Boolean(greeting || userName);

  return (
    <LinearGradient
      colors={[...(compact ? gradients.headerCompact : gradients.header)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
    >
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>Back</Text>
        </Pressable>
      ) : null}

      {showUserRow ? (
        <View style={styles.userRow}>
          <View style={styles.userText}>
            {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
            {userName ? <Text style={styles.userName}>{userName}</Text> : null}
            {subtitle ? <Text style={styles.subtitleInline}>{subtitle}</Text> : null}
          </View>
          {userInitials ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.titleRow}>
            {onBack ? <View style={styles.backSpacer} /> : null}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.backSpacer} />
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  backButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backSpacer: {
    width: 44,
  },
  title: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.white,
    opacity: 0.88,
    marginTop: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greeting: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    marginBottom: spacing.xs,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitleInline: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.tealBright,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.tealDeep,
  },
});

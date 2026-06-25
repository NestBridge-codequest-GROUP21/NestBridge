import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  lineHeights,
  layout,
  motion,
} from '../../constants/theme';

export interface OnboardingReadyScreenProps {
  userName: string;
  subtitle: string;
  matchHint: string;
  ctaLabel: string;
  roleLabel?: string;
  onEnterDashboard?: () => void;
}

export default function OnboardingReadyScreen({
  userName,
  subtitle,
  matchHint,
  ctaLabel,
  roleLabel,
  onEnterDashboard,
}: OnboardingReadyScreenProps) {
  const insets = useSafeAreaInsets();
  const firstName = userName.split(' ')[0];
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: motion.durationNormal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const badgeScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const contentOpacity = entrance;
  const contentTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [spacing.md, 0],
  });

  return (
    <LinearGradient
      colors={[...gradients.header]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.badgeRow,
            {
              opacity: contentOpacity,
              transform: [{ scale: badgeScale }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeCheck} accessibilityElementsHidden>
              ✓
            </Text>
            <Text style={styles.badgeText}>Profile saved</Text>
          </View>
          {roleLabel ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{roleLabel}</Text>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <Text style={styles.title}>
            You are all set,{'\n'}
            <Text style={styles.titleAccent}>{firstName}</Text>
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.hintCard}>
            <View style={styles.hintAccent} />
            <Text style={styles.hintText}>{matchHint}</Text>
          </View>
        </Animated.View>
      </View>

      <PrimaryButton label={ctaLabel} onPress={onEnterDashboard} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.tealBright,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    gap: spacing.sm,
  },
  badgeCheck: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navyMid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.tealBright,
  },
  roleBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: lineHeights.display,
    marginBottom: spacing.md,
  },
  titleAccent: {
    color: colors.tealBright,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.white,
    lineHeight: lineHeights.subheading,
    marginBottom: spacing.xl,
    opacity: 0.92,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintAccent: {
    width: spacing.sm,
    backgroundColor: colors.teal,
  },
  hintText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
    padding: spacing.lg,
  },
});

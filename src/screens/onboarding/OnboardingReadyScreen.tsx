import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
} from '../../constants/theme';

export interface OnboardingReadyScreenProps {
  userName: string;
  destination: string;
  matchHint: string;
  onEnterDashboard?: () => void;
}

export default function OnboardingReadyScreen({
  userName,
  destination,
  matchHint,
  onEnterDashboard,
}: OnboardingReadyScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[...gradients.header]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.root, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ Profile complete</Text>
        </View>

        <Text style={styles.title}>You're all set,{'\n'}{userName.split(' ')[0]}!</Text>
        <Text style={styles.subtitle}>
          We're finding host families in {destination} that fit your preferences.
        </Text>

        <View style={styles.hintCard}>
          <Text style={styles.hintEmoji}>✨</Text>
          <Text style={styles.hintText}>{matchHint}</Text>
        </View>
      </View>

      <PrimaryButton label="Find my matches →" onPress={onEnterDashboard} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealBright,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: fontSizes.display + 4,
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  hintEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  hintText: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes, fontWeights, spacing, borderRadius, gradients } from '../../constants/theme';

export interface SplashScreenProps {
  appName: string;
  tagline: string;
  subtitle: string;
}

export default function SplashScreen({ appName, tagline, subtitle }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[...gradients.header]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar style="light" />

      <View style={styles.center}>
        <View style={styles.logoMark}>
          <Text style={styles.logoIcon}>✈️</Text>
        </View>
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: fontSizes.display + 4,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    opacity: 0.85,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.6,
    textAlign: 'center',
    paddingBottom: spacing.xl,
  },
});

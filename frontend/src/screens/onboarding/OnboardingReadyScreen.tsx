import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import OnboardingNextStepsCard, {
  type OnboardingNextStep,
} from '../../components/OnboardingNextStepsCard';
import FeatureHighlightRow, {
  type FeatureHighlight,
} from '../../components/FeatureHighlightRow';
import AppIcon from '../../components/AppIcon';
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
  roleHeadline: string;
  subtitle: string;
  heroIcon: string;
  nextSteps: OnboardingNextStep[];
  featureHighlights: FeatureHighlight[];
  ctaLabel: string;
  secondaryCtaLabel: string;
  roleLabel?: string;
  onEnterDashboard?: () => void;
  onExploreLater?: () => void;
  onBack?: () => void;
  onHelpPress?: () => void;
}

export default function OnboardingReadyScreen({
  roleHeadline,
  subtitle,
  heroIcon,
  nextSteps,
  featureHighlights,
  ctaLabel,
  secondaryCtaLabel,
  roleLabel,
  onEnterDashboard,
  onExploreLater,
  onBack,
  onHelpPress,
}: OnboardingReadyScreenProps) {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: motion.durationNormal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

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
      style={styles.root}
    >
      <StatusBar style="light" />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.topActionButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.topSpacer} />
        )}
        {onHelpPress ? (
          <Pressable
            onPress={onHelpPress}
            style={styles.topActionButton}
            accessibilityRole="button"
            accessibilityLabel="Help"
          >
            <AppIcon name="help-circle-outline" size={fontSizes.heading} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.topSpacer} />
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <View style={styles.hero}>
            <View style={styles.heroIconWrap}>
              <AppIcon glyph={heroIcon} size={44} color={colors.white} />
              <View style={styles.checkBadge}>
                <AppIcon name="checkmark" size={fontSizes.body} color={colors.white} />
              </View>
            </View>
            {roleLabel ? (
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{roleLabel}</Text>
              </View>
            ) : null}
            <Text style={styles.title}>
              You are all set,{'\n'}
              <Text style={styles.titleAccent}>{roleHeadline}!</Text>
            </Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <OnboardingNextStepsCard steps={nextSteps} />

          <FeatureHighlightRow items={featureHighlights} />
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <PrimaryButton label={ctaLabel} onPress={onEnterDashboard} />
        <View style={styles.secondarySpacing}>
          <SecondaryButton
            label={secondaryCtaLabel}
            onPress={onExploreLater ?? onEnterDashboard}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  topActionButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    color: colors.white,
  },
  topSpacer: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroIconWrap: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.navyMid,
    borderWidth: 2,
    borderColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  heroIcon: {
    fontSize: 44,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -spacing.xs,
    right: -spacing.xs,
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  checkText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    color: colors.white,
  },
  roleBadge: {
    backgroundColor: colors.navyMid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.tealBright,
    marginBottom: spacing.md,
  },
  roleBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.white,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: lineHeights.display,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  titleAccent: {
    color: colors.tealBright,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    color: colors.white,
    lineHeight: lineHeights.subheading,
    textAlign: 'center',
    opacity: 0.92,
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    backgroundColor: colors.navyMid,
    borderTopWidth: 1,
    borderTopColor: colors.tealDeep,
  },
  secondarySpacing: {
    marginTop: spacing.sm,
  },
});

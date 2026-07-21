import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import OnboardingNextStepsCard, {
  type OnboardingNextStep,
} from '../../components/OnboardingNextStepsCard';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  lineHeights,
  layout,
  motion,
  touchTarget,
  iconSizes,
} from '../../constants/theme';

export interface OnboardingReadyScreenProps {
  subtitle: string;
  heroImageUri: string;
  carouselCards: OnboardingNextStep[];
  ctaLabel: string;
  roleLabel: string;
  roleIcon?: string;
  onPrimaryAction?: () => void;
  onContinueLater?: () => void;
  onBack?: () => void;
}

const HERO_HEIGHT_RATIO = 0.26;

export default function OnboardingReadyScreen({
  subtitle,
  heroImageUri,
  carouselCards,
  ctaLabel,
  roleLabel,
  roleIcon,
  onPrimaryAction,
  onContinueLater,
  onBack,
}: OnboardingReadyScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients, overlays } = useTheme();


  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;
  const checkPulse = useRef(new Animated.Value(0)).current;
  const [heroFailed, setHeroFailed] = useState(false);
  const heroHeight = Dimensions.get('window').height * HERO_HEIGHT_RATIO;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: motion.durationNormal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(checkPulse, {
          toValue: 1,
          duration: motion.durationNormal,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [entrance, checkPulse]);

  const contentOpacity = entrance;
  const contentTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [spacing.md, 0],
  });
  const checkScale = checkPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.heroWrap, { height: heroHeight }]}>
        {!heroFailed ? (
          <Image
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            onError={() => setHeroFailed(true)}
          />
        ) : (
          <LinearGradient
            colors={[colors.tealDeep, colors.teal, colors.navyMid]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroFallback}
          />
        )}
        <LinearGradient
          colors={['transparent', overlays.scrimStrong]}
          style={styles.heroScrim}
        />

        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          {onBack ? (
            <BackButton onPress={onBack} color={colors.onPrimary} />
          ) : (
            <View style={styles.topSpacer} />
          )}
        </View>

        <View style={styles.roleBadge}>
          {roleIcon ? (
            <AppIcon
              glyph={roleIcon}
              size={iconSizes.md}
              color={colors.onPrimary}
              style={styles.roleBadgeIcon}
            />
          ) : null}
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>
      </View>

      <LinearGradient
        colors={gradients.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.contentGradient}
      >
        <View style={styles.decorWrap} pointerEvents="none">
          <Text style={[styles.decorGlyph, styles.decorTopRight]}>+</Text>
          <Text style={[styles.decorGlyph, styles.decorMidLeft]}>✦</Text>
          <Text style={[styles.decorGlyph, styles.decorBottomRight]}>+</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            }}
          >
            <Animated.View
              style={[
                styles.checkWrap,
                { transform: [{ scale: checkScale }] },
              ]}
              accessibilityRole="image"
              accessibilityLabel="Setup complete"
            >
              <View style={styles.checkRing}>
                <AppIcon
                  name="checkmark"
                  size={iconSizes.xl}
                  color={colors.onPrimary}
                />
              </View>
            </Animated.View>

            <Text style={styles.headline}>You're all set</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.stepsSection}>
              <OnboardingNextStepsCard steps={carouselCards} />
            </View>
          </Animated.View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
          ]}
        >
          <PrimaryButton label={ctaLabel} onPress={onPrimaryAction} />
          <Pressable
            onPress={onContinueLater}
            style={({ pressed }) => [
              styles.continueLaterButton,
              pressed && styles.continueLaterPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue Later"
          >
            <Text style={styles.continueLaterLabel}>Continue Later</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

function createStyles({ colors, shadows, overlays }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  heroWrap: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.navyMid,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroFallback: {
    ...StyleSheet.absoluteFillObject,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    zIndex: 2,
  },
  topSpacer: {
    width: touchTarget,
  },
  roleBadge: {
    position: 'absolute',
    left: layout.screenPaddingHorizontal,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navyMid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: borderWidths.hairline,
    borderColor: colors.tealBright,
    zIndex: 2,
    ...shadows.card,
  },
  roleBadgeIcon: {
    marginRight: spacing.xs,
  },
  roleBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.onPrimary,
  },
  contentGradient: {
    flex: 1,
    position: 'relative',
  },
  decorWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorGlyph: {
    position: 'absolute',
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.heading,
    color: colors.gold,
    opacity: 0.22,
  },
  decorTopRight: {
    top: spacing.md,
    right: spacing.xl,
  },
  decorMidLeft: {
    top: spacing.xl * 2,
    left: spacing.lg,
  },
  decorBottomRight: {
    bottom: spacing.xl,
    right: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  checkWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkRing: {
    width: touchTarget + spacing.md,
    height: touchTarget + spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidths.strong,
    borderColor: colors.white,
    ...shadows.raised,
  },
  headline: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.semibold,
    color: colors.onPrimary,
    lineHeight: lineHeights.display,
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.onPrimary,
    lineHeight: lineHeights.body,
    textAlign: 'center',
    opacity: 0.92,
    marginBottom: spacing.lg,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  stepsSection: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.sm,
    gap: spacing.xs,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: overlays.scrim,
  },
  continueLaterButton: {
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  continueLaterPressed: {
    opacity: 0.75,
  },
  continueLaterLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.onPrimary,
    textDecorationLine: 'underline',
  },
});
}


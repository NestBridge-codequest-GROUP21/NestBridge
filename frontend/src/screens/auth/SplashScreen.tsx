import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Pressable,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandLogoMark from '../../components/BrandLogoMark';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  motion,
} from '../../constants/theme';
import { splashCopy } from '../../data/appCopy';

const BG_SHIFT_MS = 10000;
/** Cold-start brand hold — short enough to feel like a normal app launch. */
const SPLASH_AUTO_MS = 2500;
const TAGLINE = splashCopy.tagline;
const CONTINUE_HINT = splashCopy.continueHint;

export interface SplashScreenProps {
  appName: string;
  subtitle?: string;
  onContinue?: () => void;
}

function ShiftingGradientBackground() {
  const shift = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shift, {
          toValue: 1,
          duration: BG_SHIFT_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shift, {
          toValue: 0,
          duration: BG_SHIFT_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shift]);

  const translateX = shift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -width * 0.35, 0],
  });

  const translateY = shift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, height * 0.12, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.gradientLayer,
        { transform: [{ translateX }, { translateY }] },
      ]}
    >
      <LinearGradient
        colors={[colors.navy, colors.navyMid, colors.tealDeep, colors.tealBright]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: width * 1.6, height: height * 1.4 }}
      />
    </Animated.View>
  );
}

function DriftRing({
  size,
  style,
  durationMs,
  reverse,
  borderColor,
  borderOpacity,
}: {
  size: number;
  style: ViewStyle;
  durationMs: number;
  reverse?: boolean;
  borderColor: string;
  borderOpacity: number;
}) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: durationMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [drift, durationMs]);

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: reverse
      ? [spacing.sm, -spacing.sm, spacing.sm]
      : [0, spacing.sm, 0],
  });

  const translateY = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: reverse
      ? [-spacing.md, spacing.sm, -spacing.md]
      : [0, -spacing.md, 0],
  });

  const scale = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.driftRing,
        style,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          opacity: borderOpacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

function LoadingDots() {
  return (
    <View style={styles.dots} accessibilityRole="progressbar">
      {[0, 1, 2].map((index) => (
        <PulsingDot key={index} delayMs={index * 200} accent={index === 1} />
      ))}
    </View>
  );
}

function PulsingDot({ delayMs, accent }: { delayMs: number; accent?: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [delayMs, pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const scale = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        accent && styles.dotAccent,
        { opacity, transform: [{ scale }] },
      ]}
    />
  );
}

function BrandTitle({ appName }: { appName: string }) {
  const nestPart = 'Nest';
  const bridgePart = appName.startsWith(nestPart) ? appName.slice(nestPart.length) : null;

  if (bridgePart) {
    return (
      <Text style={styles.appName} accessibilityRole="header">
        <Text style={styles.appNameNest}>{nestPart}</Text>
        <Text style={styles.appNameBridge}>{bridgePart}</Text>
      </Text>
    );
  }

  return (
    <Text style={styles.appNameSingle} accessibilityRole="header">
      {appName}
    </Text>
  );
}

export default function SplashScreen({ appName, onContinue }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
  const wordReveal = useRef(new Animated.Value(0)).current;
  const continuedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.timing(wordReveal, {
      toValue: 1,
      duration: motion.durationNormal,
      delay: motion.durationFast,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [wordReveal]);

  const handleContinue = useCallback(() => {
    if (!onContinue || continuedRef.current) {
      return;
    }
    continuedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onContinue();
  }, [onContinue]);

  useEffect(() => {
    if (!onContinue) {
      return undefined;
    }
    timerRef.current = setTimeout(handleContinue, SPLASH_AUTO_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleContinue, onContinue]);

  const wordOpacity = wordReveal;
  const wordTranslateY = wordReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [spacing.md, 0],
  });

  return (
    <Pressable
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      onPress={handleContinue}
      disabled={!onContinue}
      accessibilityRole={onContinue ? 'button' : undefined}
      accessibilityLabel={onContinue ? 'Continue' : undefined}
      accessibilityHint={onContinue ? 'Skips the splash wait' : undefined}
    >
      <StatusBar style="light" />
      <ShiftingGradientBackground />

      <DriftRing
        size={screenWidth * 0.72}
        style={{ top: -spacing.xl, right: -spacing.xl }}
        durationMs={8000}
        borderColor={colors.white}
        borderOpacity={0.12}
      />
      <DriftRing
        size={screenWidth}
        style={{ bottom: -spacing.xl * 2, left: -spacing.xl * 2 }}
        durationMs={11000}
        reverse
        borderColor={colors.white}
        borderOpacity={0.08}
      />
      <DriftRing
        size={screenWidth * 0.4}
        style={{ bottom: spacing.xl * 2, right: spacing.lg }}
        durationMs={7000}
        borderColor={colors.gold}
        borderOpacity={0.25}
      />

      <View style={styles.content}>
        <BrandLogoMark accessibilityLabel={`${appName} icon`} />

        <Animated.View
          style={[
            styles.word,
            {
              opacity: wordOpacity,
              transform: [{ translateY: wordTranslateY }],
            },
          ]}
        >
          <BrandTitle appName={appName} />
          <Text style={styles.tagline}>{TAGLINE}</Text>
        </Animated.View>

        <LoadingDots />
      </View>

      {onContinue ? (
        <Animated.Text style={[styles.continueHint, { opacity: wordOpacity }]}>
          {CONTINUE_HINT}
        </Animated.Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
    overflow: 'hidden',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driftRing: {
    position: 'absolute',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    zIndex: 2,
  },
  word: {
    alignItems: 'center',
    gap: spacing.md,
  },
  appName: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  appNameNest: {
    color: colors.white,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
  },
  appNameBridge: {
    color: colors.tealBright,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
  },
  appNameSingle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
  },
  tagline: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.gold,
    letterSpacing: spacing.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    opacity: 0.3,
  },
  dotAccent: {
    backgroundColor: colors.teal,
  },
  continueHint: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.55,
    textAlign: 'center',
  },
});

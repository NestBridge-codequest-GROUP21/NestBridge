import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import BrandLogo from '../../components/BrandLogo';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  motion,
  layout,
  lineHeights,
  iconSizes,
} from '../../constants/theme';
import { splashCopy } from '../../data/appCopy';

const BG_SHIFT_MS = 10000;
const BEAT1_MS = motion.durationSplashBeat1;
const TOTAL_MS = motion.durationSplashTotal;

export interface SplashScreenProps {
  appName: string;
  motto?: string;
  description?: string;
  onContinue?: () => void;
}

function ShiftingGradientBackground() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
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
  const styles = useThemedStyles(createStyles);
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

function FlyingPlane() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { width, height } = Dimensions.get('window');
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: TOTAL_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-spacing.xxl, width + spacing.xxl],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [height * 0.22, height * 0.16, height * 0.2],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.85, 1],
    outputRange: [0, 0.55, 0.45, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.plane,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate: '-12deg' }],
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <AppIcon name="airplane-outline" size={iconSizes.xl} color={colors.onPrimary} />
    </Animated.View>
  );
}

function LoadingDots() {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.dots} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {[0, 1, 2].map((index) => (
        <PulsingDot key={index} delayMs={index * 200} accent={index === 1} />
      ))}
    </View>
  );
}

function PulsingDot({ delayMs, accent }: { delayMs: number; accent?: boolean }) {
  const styles = useThemedStyles(createStyles);
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
  const styles = useThemedStyles(createStyles);
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

export default function SplashScreen({
  appName,
  motto = splashCopy.tagline,
  description = splashCopy.description,
  onContinue,
}: SplashScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
  const [beat, setBeat] = useState<1 | 2>(1);
  const logoPulse = useRef(new Animated.Value(0)).current;
  const beat2Reveal = useRef(new Animated.Value(0)).current;
  const continuedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const handleContinue = useCallback(() => {
    if (!onContinue || continuedRef.current) {
      return;
    }
    continuedRef.current = true;
    clearTimers();
    onContinue();
  }, [onContinue, clearTimers]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: motion.durationNormal * 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 0,
          duration: motion.durationNormal * 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [logoPulse]);

  useEffect(() => {
    if (!onContinue) {
      return undefined;
    }
    const beat2Timer = setTimeout(() => {
      setBeat(2);
      Animated.timing(beat2Reveal, {
        toValue: 1,
        duration: motion.durationNormal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, BEAT1_MS);
    const doneTimer = setTimeout(handleContinue, TOTAL_MS);
    timersRef.current = [beat2Timer, doneTimer];
    return () => clearTimers();
  }, [onContinue, handleContinue, beat2Reveal, clearTimers]);

  const logoScale = logoPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const wordOpacity = beat2Reveal;
  const wordTranslateY = beat2Reveal.interpolate({
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
      accessibilityLabel={onContinue ? 'Skip splash and continue' : undefined}
      accessibilityHint={onContinue ? 'Opens Welcome or Create account' : undefined}
    >
      <StatusBar style="light" />
      <ShiftingGradientBackground />

      <DriftRing
        size={screenWidth * 0.72}
        style={{ top: -spacing.xl, right: -spacing.xl }}
        durationMs={8000}
        borderColor={colors.white}
        borderOpacity={beat === 1 ? 0.14 : 0.1}
      />
      <DriftRing
        size={screenWidth}
        style={{ bottom: -spacing.xl * 2, left: -spacing.xl * 2 }}
        durationMs={11000}
        reverse
        borderColor={colors.white}
        borderOpacity={beat === 1 ? 0.1 : 0.07}
      />
      <DriftRing
        size={screenWidth * 0.4}
        style={{ bottom: spacing.xl * 2, right: spacing.lg }}
        durationMs={7000}
        borderColor={colors.gold}
        borderOpacity={beat === 1 ? 0.28 : 0.18}
      />

      <FlyingPlane />

      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: logoScale }] }}>
          <BrandLogo
            size="xl"
            framed
            accessibilityLabel={`${appName} logo`}
          />
        </Animated.View>

        {beat === 2 ? (
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
            <Text style={styles.motto}>{motto}</Text>
            <Text style={styles.description}>{description}</Text>
          </Animated.View>
        ) : null}

        <LoadingDots />
      </View>

      {onContinue ? (
        <Text style={styles.continueHint}>{splashCopy.continueHint}</Text>
      ) : null}
    </Pressable>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
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
      borderWidth: borderWidths.hairline,
      backgroundColor: 'transparent',
    },
    plane: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xl,
      zIndex: 2,
      paddingHorizontal: layout.screenPaddingHorizontal,
    },
    word: {
      alignItems: 'center',
      gap: spacing.md,
      maxWidth: spacing.xxl * 8,
    },
    appName: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.display,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.display,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    appNameNest: {
      fontFamily: fontFamilies.bold,
      color: colors.onPrimary,
      fontSize: fontSizes.display,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.display,
    },
    appNameBridge: {
      fontFamily: fontFamilies.bold,
      color: colors.tealBright,
      fontSize: fontSizes.display,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.display,
    },
    appNameSingle: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.display,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.display,
      color: colors.onPrimary,
      textAlign: 'center',
    },
    motto: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.subheading,
      color: colors.gold,
      textAlign: 'center',
    },
    description: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.body,
      color: colors.onPrimary,
      opacity: 0.82,
      textAlign: 'center',
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
      backgroundColor: colors.surface,
      opacity: 0.3,
    },
    dotAccent: {
      backgroundColor: colors.teal,
    },
    continueHint: {
      position: 'absolute',
      left: layout.screenPaddingHorizontal,
      right: layout.screenPaddingHorizontal,
      bottom: spacing.xl,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.caption,
      color: colors.onPrimary,
      opacity: 0.55,
      textAlign: 'center',
      zIndex: 3,
    },
  });
}

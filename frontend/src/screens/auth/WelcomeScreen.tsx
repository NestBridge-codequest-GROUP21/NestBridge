import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandLogoMark from '../../components/BrandLogoMark';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import DemoActorQuickLogin from '../../components/DemoActorQuickLogin';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import type { DemoAccount } from '../../data/demoAccounts';
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
  avatarSizes,
} from '../../constants/theme';

const WELCOME_LOGO_SIZE = spacing.xl * 3;

export interface WelcomeValuePill {
  icon: string;
  label: string;
}

export interface WelcomeScreenProps {
  appName: string;
  headline: string;
  subheadline: string;
  tagline?: string;
  valuePills?: WelcomeValuePill[];
  demoAccounts?: DemoAccount[];
  demoLoginBusy?: boolean;
  onDemoLogin?: (account: DemoAccount) => void;
  onCreateAccount?: () => void;
  onSignIn?: () => void;
  onStaffSignIn?: () => void;
}

function DriftRing({ size, style }: { size: number; style: object }) {
  const styles = useThemedStyles(createStyles);

  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [drift]);

  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spacing.sm],
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
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

export default function WelcomeScreen({
  headline,
  subheadline,
  tagline,
  valuePills = [],
  demoAccounts = [],
  demoLoginBusy = false,
  onDemoLogin,
  onCreateAccount,
  onSignIn,
  onStaffSignIn,
}: WelcomeScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
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
    outputRange: [spacing.lg, 0],
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={gradients.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
        >
          <DriftRing
            size={screenWidth * 0.55}
            style={{ position: 'absolute', top: -spacing.xl, right: -spacing.lg }}
          />

          <BrandLogoMark size={WELCOME_LOGO_SIZE} framed />

          {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}

          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
              alignSelf: 'stretch',
            }}
          >
            <Text style={styles.headline}>{headline}</Text>
            <Text style={styles.subheadline}>{subheadline}</Text>
          </Animated.View>
        </LinearGradient>

        <Animated.View
          style={[
            styles.pillsSection,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <View style={styles.pillsWrap}>
            {valuePills.map((pill) => (
              <Card key={pill.label} style={styles.pill} padding="md">
                <View style={styles.pillIconTile}>
                  <AppIcon glyph={pill.icon} size={iconSizes.md} color={colors.tealDeep} />
                </View>
                <Text style={styles.pillLabel}>{pill.label}</Text>
              </Card>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        {demoAccounts.length > 0 ? (
          <>
            <DemoActorQuickLogin
              accounts={demoAccounts}
              busy={demoLoginBusy}
              variant="tabs"
              title="Quick sign-in"
              hint="Use a NestBridge sample profile to look around."
              onSelect={onDemoLogin}
            />
            <Text style={styles.dividerLabel}>or continue with your account</Text>
          </>
        ) : null}
        <PrimaryButton label="Create account" onPress={onCreateAccount} />
        <View style={styles.signInSpacer} />
        <SecondaryButton label="Sign in" onPress={onSignIn} />
        {onStaffSignIn ? (
          <>
            <View style={styles.signInSpacer} />
            <Pressable
              onPress={onStaffSignIn}
              accessibilityRole="button"
              accessibilityLabel="Staff sign-in"
              style={({ pressed }) => [styles.staffLink, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.staffLinkText}>Staff sign-in</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
  },
  driftRing: {
    borderWidth: borderWidths.hairline,
    borderColor: colors.white,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  tagline: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.gold,
    letterSpacing: spacing.xs,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headline: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.onPrimary,
    lineHeight: lineHeights.heading,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subheadline: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.onPrimary,
    opacity: 0.88,
    lineHeight: lineHeights.body,
    textAlign: 'center',
  },
  pillsSection: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  pillsWrap: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touchTarget,
  },
  pillIconTile: {
    width: avatarSizes.md,
    height: avatarSizes.md,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  signInSpacer: {
    height: spacing.sm,
  },
  staffLink: {
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffLinkText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  dividerLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
}


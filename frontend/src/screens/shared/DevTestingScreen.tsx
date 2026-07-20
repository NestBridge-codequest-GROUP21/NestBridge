import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import SecondaryButton from '../../components/SecondaryButton';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import { devTestingCopy } from '../../data/appCopy';
import type { DemoAccount } from '../../data/demoAccounts';
import { DEMO_ACTOR_ACCOUNTS } from '../../data/demoAccounts';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
  gradients,
  lineHeights,
} from '../../constants/theme';
import type { PrimaryIntent, SetupTrack } from '../../types/accountProfile';
import {
  DEV_HOME_PRESETS,
  DEV_PARTIAL_PRESETS,
  homeRouteForIntent,
  presetExchangeStudentFlag,
  presetHomeDashboard,
  presetNewUser,
  presetPartialOnboarding,
  type DevHomeRoute,
} from '../../utils/devTestingPresets';

export interface DevTestingScreenProps {
  isActiveExchangeStudent: boolean;
  demoLoginBusy?: boolean;
  demoLoginError?: string | null;
  onBack?: () => void;
  onApplyPreset: (options: {
    preset: ReturnType<typeof presetNewUser>;
    navigateTo: DevHomeRoute;
    resumeTrack?: SetupTrack;
  }) => void;
  onToggleExchangeStudent: (active: boolean) => void;
  onResetDemo: () => void;
  onDemoActorLogin?: (account: DemoAccount) => void;
}

function DevSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={styles.section} padding="lg">
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Card>
  );
}

function DevButton({
  label,
  onPress,
  variant = 'default',
}: {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'danger';
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.devButton,
        variant === 'danger' && styles.devButtonDanger,
        pressed && styles.devButtonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.devButtonText,
          variant === 'danger' && styles.devButtonTextDanger,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function DevTestingScreen({
  isActiveExchangeStudent,
  demoLoginBusy = false,
  demoLoginError,
  onBack,
  onApplyPreset,
  onToggleExchangeStudent,
  onResetDemo,
  onDemoActorLogin,
}: DevTestingScreenProps) {
  const insets = useSafeAreaInsets();

  const applyHome = (intent: PrimaryIntent | null) => {
    if (!intent) {
      onApplyPreset({ preset: presetNewUser(), navigateTo: 'IntentSelect' });
      return;
    }
    onApplyPreset({
      preset: presetHomeDashboard(intent),
      navigateTo: homeRouteForIntent(intent),
    });
  };

  const applyPartial = (intent: PrimaryIntent, track: SetupTrack) => {
    onApplyPreset({
      preset: presetPartialOnboarding(intent, track),
      navigateTo: homeRouteForIntent(intent),
      resumeTrack: track,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerTop}>
          {onBack ? (
            <BackButton onPress={onBack} color={colors.white} />
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <Text style={styles.headerTitle}>{devTestingCopy.title}</Text>
          <View style={styles.backPlaceholder} />
        </View>
        <Text style={styles.headerSubtitle}>{devTestingCopy.subtitle}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DevSection title={devTestingCopy.demoActorsTitle}>
          <Text style={styles.sectionBody}>{devTestingCopy.demoActorsHint}</Text>
          {demoLoginError ? (
            <InlineBanner tone="error" message={demoLoginError} />
          ) : null}
          {DEMO_ACTOR_ACCOUNTS.map((account) => (
            <DevButton
              key={account.id}
              label={`${account.label} — ${account.name}`}
              onPress={
                demoLoginBusy ? undefined : () => onDemoActorLogin?.(account)
              }
            />
          ))}
        </DevSection>

        <DevSection title={devTestingCopy.homeDashboardsTitle}>
          {DEV_HOME_PRESETS.map((item) => (
            <DevButton
              key={item.label}
              label={item.label}
              onPress={() => applyHome(item.intent)}
            />
          ))}
        </DevSection>

        <DevSection title={devTestingCopy.partialOnboardingTitle}>
          {DEV_PARTIAL_PRESETS.map((item) => (
            <DevButton
              key={item.label}
              label={item.label}
              onPress={() => applyPartial(item.intent, item.track)}
            />
          ))}
        </DevSection>

        <DevSection title={devTestingCopy.exchangeStudentTitle}>
          <Text style={styles.sectionBody}>
            {isActiveExchangeStudent
              ? devTestingCopy.exchangeStudentActive
              : devTestingCopy.exchangeStudentInactive}
          </Text>
          <DevButton
            label={
              isActiveExchangeStudent
                ? 'Mark no longer on exchange'
                : 'Mark as active exchange student'
            }
            onPress={() => onToggleExchangeStudent(!isActiveExchangeStudent)}
          />
          <DevButton
            label="Student home + active exchange"
            onPress={() =>
              onApplyPreset({
                preset: presetExchangeStudentFlag(true),
                navigateTo: 'StudentHome',
              })
            }
          />
          <DevButton
            label="Student home + exchange ended"
            onPress={() =>
              onApplyPreset({
                preset: presetExchangeStudentFlag(false),
                navigateTo: 'StudentHome',
              })
            }
          />
        </DevSection>

        <DevSection title="Reset">
          <Text style={styles.sectionBody}>{devTestingCopy.resetHint}</Text>
          <SecondaryButton label={devTestingCopy.resetLabel} onPress={onResetDemo} />
        </DevSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backPlaceholder: {
    width: touchTarget,
    height: touchTarget,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  body: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  bodyContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.md,
  },
  devButton: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    marginBottom: spacing.sm,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  devButtonDanger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  devButtonPressed: {
    opacity: 0.9,
  },
  devButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  devButtonTextDanger: {
    color: colors.white,
  },
});

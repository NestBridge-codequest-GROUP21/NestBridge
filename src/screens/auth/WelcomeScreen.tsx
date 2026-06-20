import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
} from '../../constants/theme';

export interface RoleOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface WelcomeScreenProps {
  appName: string;
  headline: string;
  subheadline: string;
  roles: RoleOption[];
  selectedRoleId: string;
  onSelectRole?: (roleId: string) => void;
  onGetStarted?: () => void;
  onSignIn?: () => void;
  onContinueAsGuest?: () => void;
}

export default function WelcomeScreen({
  appName,
  headline,
  subheadline,
  roles,
  selectedRoleId,
  onSelectRole,
  onGetStarted,
  onSignIn,
  onContinueAsGuest,
}: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
      >
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.subheadline}>{subheadline}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>I am a...</Text>

        {roles.map((role) => {
          const selected = role.id === selectedRoleId;
          return (
            <Pressable
              key={role.id}
              style={({ pressed }) => [
                styles.roleCard,
                selected && styles.roleCardSelected,
                pressed && styles.roleCardPressed,
              ]}
              onPress={() => onSelectRole?.(role.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={role.label}
            >
              <View style={[styles.roleIconWrap, selected && styles.roleIconWrapSelected]}>
                <Text style={styles.roleIcon}>{role.icon}</Text>
              </View>
              <View style={styles.roleText}>
                <Text style={[styles.roleLabel, selected && styles.roleLabelSelected]}>
                  {role.label}
                </Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <PrimaryButton label="Get Started →" onPress={onGetStarted} />
        <View style={styles.signInSpacer} />
        <SecondaryButton label="Sign In" onPress={onSignIn} />

        <Pressable
          onPress={onContinueAsGuest}
          style={styles.guestLink}
          accessibilityRole="link"
          accessibilityLabel="Continue as guest"
        >
          <Text style={styles.guestText}>Just exploring? Continue as guest</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  appName: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.tealBright,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subheadline: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    lineHeight: 20,
  },
  body: {
    flex: 1,
    marginTop: -spacing.md,
  },
  bodyContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  roleCardPressed: {
    opacity: 0.95,
  },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleIconWrapSelected: {
    backgroundColor: colors.white,
  },
  roleIcon: {
    fontSize: 22,
  },
  roleText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  roleLabel: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roleLabelSelected: {
    color: colors.tealDeep,
  },
  roleDescription: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.teal,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  signInSpacer: {
    height: spacing.sm,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  guestText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { DemoAccount } from '../data/demoAccounts';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  tints,
} from '../constants/theme';

const ROLE_ICONS: Record<string, string> = {
  student: '🎓',
  tourist: '🧳',
  host: '🏠',
  guide: '🗺️',
};

export interface DemoActorQuickLoginProps {
  accounts: DemoAccount[];
  busy?: boolean;
  variant?: 'tabs' | 'cards';
  title?: string;
  hint?: string;
  onSelect?: (account: DemoAccount) => void;
}

export default function DemoActorQuickLogin({
  accounts,
  busy = false,
  variant = 'tabs',
  title = 'Try a demo account',
  hint = 'One tap — password for all: password',
  onSelect,
}: DemoActorQuickLoginProps) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      {variant === 'tabs' ? (
        <View style={styles.tabGrid}>
          {accounts.map((account) => (
            <Pressable
              key={account.id}
              style={({ pressed }) => [
                styles.tabCard,
                pressed && styles.tabCardPressed,
                busy && styles.disabled,
              ]}
              onPress={() => onSelect?.(account)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={`Demo ${account.label}, ${account.name}`}
            >
              <Text style={styles.tabIcon}>{ROLE_ICONS[account.id] ?? '👤'}</Text>
              <Text style={styles.tabLabel}>{account.label}</Text>
              <Text style={styles.tabName} numberOfLines={1}>
                {account.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        accounts.map((account) => (
          <Pressable
            key={account.id}
            style={({ pressed }) => [
              styles.demoCard,
              pressed && styles.demoCardPressed,
              busy && styles.disabled,
            ]}
            onPress={() => onSelect?.(account)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={`Sign in as demo ${account.label}, ${account.name}`}
          >
            <View style={styles.demoCardTop}>
              <View style={styles.demoRolePill}>
                <Text style={styles.demoRoleText}>{account.label}</Text>
              </View>
              <Text style={styles.demoName}>{account.name}</Text>
            </View>
            <Text style={styles.demoDescription}>{account.description}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  tabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tabCard: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
    minHeight: 88,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCardPressed: {
    backgroundColor: tints.teal,
    borderColor: colors.teal,
  },
  tabIcon: {
    fontSize: fontSizes.heading,
    marginBottom: spacing.xs,
  },
  tabLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.navy,
    textAlign: 'center',
  },
  tabName: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  demoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  demoCardPressed: {
    opacity: 0.94,
    backgroundColor: tints.teal,
  },
  demoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  demoRolePill: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  demoRoleText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  demoName: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  demoDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disabled: {
    opacity: 0.6,
  },
});

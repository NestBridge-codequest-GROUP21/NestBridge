import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import InlineBanner from '../../components/InlineBanner';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import type { PrimaryIntent } from '../../types/accountProfile';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  touchTarget,
  borderRadius,
} from '../../constants/theme';

export interface PreviewRoleOption {
  role: PrimaryIntent;
  title: string;
  body: string;
}

export interface AdminPreviewPickerScreenProps {
  options: PreviewRoleOption[];
  tabBarItems: TabBarItem[];
  onSelectRole?: (role: PrimaryIntent) => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
  onSosPress?: () => void;
}

export default function AdminPreviewPickerScreen({
  options,
  tabBarItems,
  onSelectRole,
  onTabPress,
  onBack,
  onSosPress,
}: AdminPreviewPickerScreenProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="App preview"
        subtitle="Inspect what each role sees"
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        <InlineBanner
          tone="info"
          message="Preview is logged for support audits. Booking and account changes are blocked while you preview."
        />
        <SectionHeader title="Choose a role" />
        {options.map((option) => (
          <Pressable
            key={option.role}
            onPress={() => onSelectRole?.(option.role)}
            style={({ pressed }) => [pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Card style={styles.card}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.body}>{option.body}</Text>
              <Text style={styles.cta}>Open preview</Text>
            </Card>
          </Pressable>
        ))}
      </ScreenScroll>
      <AppTabBar
        items={tabBarItems}
        activeTabId="preview"
        showSosDock
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
    </View>
  );
}

export const ADMIN_PREVIEW_ROLE_OPTIONS: PreviewRoleOption[] = [
  {
    role: 'STUDENT',
    title: 'Student home',
    body: 'Homestay search, prep checklist, events, and student explore hub.',
  },
  {
    role: 'TOURIST',
    title: 'Tourist explore',
    body: 'Guides, lodging, attractions, offline map, and trip booking.',
  },
  {
    role: 'HOST',
    title: 'Host family',
    body: 'Incoming stay requests, calendar, listings, and host earnings.',
  },
  {
    role: 'GUIDE',
    title: 'Local guide',
    body: 'Session bookings, availability, tour types, and guide earnings.',
  },
];

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      marginBottom: spacing.md,
      gap: spacing.sm,
      borderRadius: borderRadius.md,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    body: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
    },
    cta: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      marginTop: spacing.xs,
      minHeight: touchTarget / 2,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}

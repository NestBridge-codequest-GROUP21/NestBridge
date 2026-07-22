import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  touchTarget,
} from '../constants/theme';

export interface StaffPreviewBannerProps {
  roleLabel: string;
  onExit?: () => void;
}

export default function StaffPreviewBanner({
  roleLabel,
  onExit,
}: StaffPreviewBannerProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.banner, { paddingTop: Math.max(insets.top, spacing.sm) }]}>
      <View style={styles.copy}>
        <Text style={styles.title}>Staff preview · {roleLabel}</Text>
        <Text style={styles.subtitle}>Read-only view of this role’s app experience</Text>
      </View>
      {onExit ? (
        <Pressable
          onPress={onExit}
          accessibilityRole="button"
          accessibilityLabel="Exit app preview"
          style={({ pressed }) => [
            styles.exitBtn,
            { opacity: pressed ? 0.85 : 1, backgroundColor: colors.white },
          ]}
        >
          <Text style={[styles.exitLabel, { color: colors.navy }]}>Exit</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    banner: {
      backgroundColor: colors.navy,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.onPrimary,
    },
    subtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.onPrimary,
      opacity: 0.85,
      lineHeight: lineHeights.micro,
    },
    exitBtn: {
      minHeight: touchTarget,
      minWidth: touchTarget,
      paddingHorizontal: spacing.md,
      borderRadius: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exitLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
    },
  });
}

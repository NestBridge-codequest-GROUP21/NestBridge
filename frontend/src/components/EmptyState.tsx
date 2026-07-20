import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import AppIcon, { type IoniconName } from './AppIcon';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
} from '../constants/theme';

export interface EmptyStateProps {
  title: string;
  body: string;
  tip?: string;
  iconName?: IoniconName;
  iconGlyph?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
  /** When false, renders without card chrome (for full-screen empties). Default true. */
  carded?: boolean;
}

/**
 * Shared empty-state block used across list/tab screens.
 * Visual only — callers own data and actions.
 */
export default function EmptyState({
  title,
  body,
  tip,
  iconName = 'file-tray-outline',
  iconGlyph,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
  carded = true,
}: EmptyStateProps) {
  return (
    <View style={[carded ? styles.card : styles.plain, style]}>
      <View style={styles.iconTile}>
        {iconGlyph ? (
          <AppIcon glyph={iconGlyph} size={fontSizes.heading} color={colors.tealDeep} />
        ) : (
          <AppIcon name={iconName} size={fontSizes.heading} color={colors.tealDeep} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {tip ? <Text style={styles.tip}>{tip}</Text> : null}
      {primaryActionLabel && onPrimaryAction ? (
        <View style={styles.actions}>
          <PrimaryButton label={primaryActionLabel} onPress={onPrimaryAction} />
          {secondaryActionLabel && onSecondaryAction ? (
            <>
              <View style={styles.actionGap} />
              <SecondaryButton label={secondaryActionLabel} onPress={onSecondaryAction} />
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  plain: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  tip: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: lineHeights.caption,
    marginTop: spacing.md,
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  actionGap: {
    height: spacing.sm,
  },
});

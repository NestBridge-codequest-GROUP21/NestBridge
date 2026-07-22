import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import InlineBanner from './InlineBanner';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  touchTarget,
} from '../constants/theme';

export interface SectionRetryBannerProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Inline section failure with optional retry — does not block the rest of the screen. */
export default function SectionRetryBanner({
  message,
  onRetry,
  retryLabel = 'Retry',
}: SectionRetryBannerProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <InlineBanner message={message} tone="error" />
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <Text style={styles.retryText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    wrap: {
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    retry: {
      alignSelf: 'flex-start',
      minHeight: touchTarget,
      minWidth: touchTarget,
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    retryPressed: {
      opacity: 0.7,
    },
    retryText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
  });
}

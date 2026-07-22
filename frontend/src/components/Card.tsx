import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useThemedStyles, type AppTheme } from '../theme';
import {
  borderRadius,
  borderWidths,
  layout,
} from '../constants/theme';

export type CardPadding = 'md' | 'lg' | 'none';
export type CardElevation = 'none' | 'card' | 'raised';

export interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  elevation?: CardElevation;
  style?: StyleProp<ViewStyle>;
}

/** Standard surface used across list/detail screens. */
export default function Card({
  children,
  padding = 'md',
  elevation = 'card',
  style,
}: CardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View
      style={[
        styles.base,
        padding === 'md' && styles.paddingMd,
        padding === 'lg' && styles.paddingLg,
        elevation === 'none' && styles.elevationNone,
        elevation === 'card' && styles.elevationCard,
        elevation === 'raised' && styles.elevationRaised,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function createStyles({ colors, shadows, chrome }: AppTheme) {
  return StyleSheet.create({
    base: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: chrome.minimalBorders ? 0 : borderWidths.hairline,
      borderColor: colors.border,
    },
    paddingMd: {
      padding: layout.cardPadding,
    },
    paddingLg: {
      padding: layout.cardPaddingLarge,
    },
    elevationNone: {
      ...shadows.none,
    },
    elevationCard: {
      ...shadows.card,
    },
    elevationRaised: {
      ...shadows.raised,
    },
  });
}

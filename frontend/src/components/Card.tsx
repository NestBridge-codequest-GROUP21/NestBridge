import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import {
  colors,
  borderRadius,
  borderWidths,
  layout,
  shadows,
} from '../constants/theme';

export type CardPadding = 'md' | 'lg' | 'none';
export type CardElevation = 'none' | 'card' | 'raised';

export interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  elevation?: CardElevation;
  style?: StyleProp<ViewStyle>;
}

/** Standard white surface used across list/detail screens. */
export default function Card({
  children,
  padding = 'md',
  elevation = 'card',
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        padding === 'md' && styles.paddingMd,
        padding === 'lg' && styles.paddingLg,
        elevation === 'none' && shadows.none,
        elevation === 'card' && shadows.card,
        elevation === 'raised' && shadows.raised,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  paddingMd: {
    padding: layout.cardPadding,
  },
  paddingLg: {
    padding: layout.cardPaddingLarge,
  },
});

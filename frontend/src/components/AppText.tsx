import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { ColorPalette } from '../theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
} from '../constants/theme';

export type AppTextVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'micro';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  weight?: 'regular' | 'semibold' | 'bold';
  color?: keyof ColorPalette;
}

export default function AppText({
  variant = 'body',
  weight = 'regular',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        weight === 'semibold' && styles.semibold,
        weight === 'bold' && styles.bold,
        { color: colors[color] },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamilies.regular,
  },
  display: {
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
  },
  heading: {
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  subheading: {
    fontSize: fontSizes.subheading,
    lineHeight: lineHeights.subheading,
  },
  body: {
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  caption: {
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  },
  micro: {
    fontSize: fontSizes.micro,
    lineHeight: lineHeights.micro,
  },
  semibold: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
  },
  bold: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
  },
});

import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  borderRadius,
  borderWidths,
  avatarSizes,
} from '../constants/theme';

export type AvatarSize = keyof typeof avatarSizes;

export interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  highlighted?: boolean;
  style?: ViewStyle;
}

const TEXT_SIZE: Record<AvatarSize, number> = {
  sm: fontSizes.caption,
  md: fontSizes.body,
  lg: fontSizes.subheading,
  xl: fontSizes.heading,
};

/** Initials avatar with standard NestBridge sizing. */
export default function Avatar({
  initials,
  size = 'md',
  highlighted = false,
  style,
}: AvatarProps) {
  const styles = useThemedStyles(createStyles);

  const diameter = avatarSizes[size];

  return (
    <View
      style={[
        styles.base,
        {
          width: diameter,
          height: diameter,
          borderRadius: borderRadius.pill,
        },
        highlighted && styles.highlighted,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={initials}
    >
      <Text style={[styles.text, { fontSize: TEXT_SIZE[size] }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  base: {
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  highlighted: {
    borderWidth: borderWidths.strong,
    borderColor: colors.gold,
    backgroundColor: colors.white,
  },
  text: {
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
});
}


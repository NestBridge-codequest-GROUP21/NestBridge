import { useThemedStyles, type AppTheme } from '../theme';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
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
  /** Remote or local profile photo. Initials show only when missing/failed. */
  photoUri?: string | null;
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

/** Profile avatar — photo when available, otherwise initials. */
export default function Avatar({
  initials,
  photoUri,
  size = 'md',
  highlighted = false,
  style,
}: AvatarProps) {
  const styles = useThemedStyles(createStyles);
  const [imageFailed, setImageFailed] = useState(false);
  const diameter = avatarSizes[size];
  const showPhoto = Boolean(photoUri) && !imageFailed;

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
      {showPhoto ? (
        <Image
          source={{ uri: photoUri! }}
          style={{
            width: diameter,
            height: diameter,
            borderRadius: borderRadius.pill,
          }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Text style={[styles.text, { fontSize: TEXT_SIZE[size] }]}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function createStyles({ colors, tints, chrome }: AppTheme) {
  return StyleSheet.create({
    base: {
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: chrome.minimalBorders ? 0 : borderWidths.hairline,
      borderColor: colors.border,
    },
    highlighted: {
      borderWidth: borderWidths.strong,
      borderColor: colors.gold,
      backgroundColor: colors.surface,
    },
    text: {
      fontFamily: fontFamilies.bold,
      fontWeight: fontWeights.bold,
      color: colors.onAccent,
    },
  });
}

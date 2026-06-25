import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  layout,
} from '../constants/theme';

export interface ScreenScrollProps extends ScrollViewProps {
  withTabBar?: boolean;
  children: React.ReactNode;
}

export default function ScreenScroll({
  withTabBar = false,
  children,
  contentContainerStyle,
  ...rest
}: ScreenScrollProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = withTabBar
    ? insets.bottom + layout.scrollBottomInset
    : insets.bottom + spacing.lg;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPad },
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
});

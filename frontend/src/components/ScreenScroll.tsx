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
  withSosDock?: boolean;
  children: React.ReactNode;
}

export default function ScreenScroll({
  withTabBar = false,
  withSosDock = false,
  children,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = 'handled',
  ...rest
}: ScreenScrollProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = withTabBar
    ? insets.bottom +
      (withSosDock ? layout.scrollBottomInsetWithSos : layout.scrollBottomInset)
    : insets.bottom + spacing.lg;

  return (
    <ScrollView
      style={[styles.scroll, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode="on-drag"
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
});

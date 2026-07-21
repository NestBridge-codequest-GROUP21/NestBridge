import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import useKeyboardHeight from '../hooks/useKeyboardHeight';

export interface KeyboardSafeViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Extra offset for headers / absolute footers. */
  keyboardVerticalOffset?: number;
  /**
   * When false, skips avoidance (rare — e.g. full-screen media).
   * Defaults to true.
   */
  enabled?: boolean;
}

/**
 * Cross-platform keyboard avoidance for screens that are not (only) a scroll view.
 * Prefer `ScreenScroll` for form pages — it also scrolls the focused input into view.
 *
 * Android (priority): adds bottom padding equal to the keyboard height so footers
 * and composers stay visible with edge-to-edge layouts.
 * iOS: uses KeyboardAvoidingView padding.
 */
export default function KeyboardSafeView({
  children,
  style,
  keyboardVerticalOffset = 0,
  enabled = true,
}: KeyboardSafeViewProps) {
  const keyboardHeight = useKeyboardHeight();
  const androidPad =
    enabled && Platform.OS === 'android' ? keyboardHeight : 0;

  return (
    <KeyboardAvoidingView
      style={[
        styles.root,
        style,
        androidPad > 0 ? { paddingBottom: androidPad } : null,
      ]}
      behavior={enabled && Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={enabled && Platform.OS === 'ios'}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

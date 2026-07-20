import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

export interface KeyboardSafeViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Extra offset for headers / absolute footers. */
  keyboardVerticalOffset?: number;
}

/**
 * Cross-platform keyboard avoidance.
 * Android uses `padding` so inputs stay above the soft keyboard with edge-to-edge layouts.
 */
export default function KeyboardSafeView({
  children,
  style,
  keyboardVerticalOffset = 0,
}: KeyboardSafeViewProps) {
  return (
    <KeyboardAvoidingView
      style={[styles.root, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
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

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
} from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../constants/theme';

export interface FormTextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  /** When true with secureTextEntry, shows an inline Show/Hide control. */
  visibilityToggle?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  textContentType?: TextInputProps['textContentType'];
}

export default function FormTextField({
  label,
  value,
  placeholder,
  onChangeText,
  secureTextEntry,
  visibilityToggle = false,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  textContentType,
}: FormTextFieldProps) {
  const [visible, setVisible] = useState(false);
  const showToggle = Boolean(secureTextEntry && visibilityToggle);
  const isSecure = Boolean(secureTextEntry) && !(showToggle && visible);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, showToggle && styles.inputWithToggle]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
        />
        {showToggle ? (
          <Pressable
            onPress={() => setVisible((current) => !current)}
            style={styles.toggleButton}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            hitSlop={8}
          >
            <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    minHeight: 48,
  },
  inputWithToggle: {
    paddingRight: spacing.xl + spacing.lg,
  },
  toggleButton: {
    position: 'absolute',
    right: spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  toggleText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});

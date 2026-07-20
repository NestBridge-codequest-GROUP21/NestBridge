import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
} from 'react-native';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  lineHeights,
} from '../constants/theme';

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
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  errorMessage?: string;
  helperText?: string;
  onBlur?: () => void;
  onFocus?: () => void;
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
  editable = true,
  multiline = false,
  numberOfLines,
  errorMessage,
  helperText,
  onBlur,
  onFocus,
}: FormTextFieldProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const showToggle = Boolean(secureTextEntry && visibilityToggle);
  const isSecure = Boolean(secureTextEntry) && !(showToggle && visible);
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          hasError && styles.inputRowError,
          !editable && styles.inputRowDisabled,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            showToggle && styles.inputWithToggle,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
        />
        {showToggle ? (
          <Pressable
            onPress={() => setVisible((current) => !current)}
            style={styles.toggleButton}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            hitSlop={spacing.sm}
          >
            <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamilies.semibold,
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
    backgroundColor: colors.surface,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  inputRowFocused: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  inputRowDisabled: {
    backgroundColor: colors.background,
    opacity: 0.85,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    minHeight: controlHeights.md,
  },
  inputMultiline: {
    minHeight: controlHeights.lg + spacing.lg,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  inputWithToggle: {
    paddingRight: spacing.xl + spacing.lg,
  },
  toggleButton: {
    position: 'absolute',
    right: spacing.sm,
    minHeight: controlHeights.md,
    minWidth: controlHeights.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  toggleText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  helperText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
}


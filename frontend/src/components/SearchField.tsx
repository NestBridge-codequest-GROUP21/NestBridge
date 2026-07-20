import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import AppIcon from './AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  controlHeights,
  iconSizes,
  lineHeights,
  touchTarget,
} from '../constants/theme';

export interface SearchFieldProps {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  onSubmitEditing?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

/** Compact search input with leading icon and optional clear control. */
export default function SearchField({
  value,
  placeholder = 'Search',
  onChangeText,
  onClear,
  onSubmitEditing,
  style,
  autoFocus = false,
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);
  const showClear = value.length > 0 && (onClear || onChangeText);

  return (
    <View
      style={[
        styles.wrap,
        focused && styles.wrapFocused,
        style,
      ]}
    >
      <AppIcon
        name="search-outline"
        size={iconSizes.md}
        color={colors.textTertiary}
        style={styles.leadingIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
        accessibilityLabel={placeholder}
      />
      {showClear ? (
        <Pressable
          onPress={() => {
            onClear?.();
            onChangeText?.('');
          }}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={spacing.sm}
        >
          <AppIcon
            name="close-circle"
            size={iconSizes.md}
            color={colors.textTertiary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: controlHeights.md,
    paddingHorizontal: spacing.sm,
  },
  wrapFocused: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
  },
  leadingIcon: {
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    minHeight: controlHeights.md,
  },
  clearButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

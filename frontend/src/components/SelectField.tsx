import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
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
  overlays,
  touchTarget,
  lineHeights,
} from '../constants/theme';

export interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect?: (value: string) => void;
}

export default function SelectField({
  label,
  value,
  placeholder,
  options,
  onSelect,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect?.(option);
    setOpen(false);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.field}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value || placeholder }}
      >
        <Text style={[styles.fieldText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <AppIcon
          name="chevron-down"
          size={iconSizes.md}
          color={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView
              style={styles.optionScroll}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => handleSelect(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {selected ? (
                      <AppIcon
                        name="checkmark"
                        size={iconSizes.md}
                        color={colors.teal}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    minHeight: touchTarget,
  },
  fieldText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: overlays.scrim,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    maxHeight: '70%',
  },
  sheetTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  optionScroll: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: touchTarget,
  },
  optionSelected: {
    backgroundColor: colors.warmCream,
  },
  optionText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
});

import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useThemedStyles, type AppTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
} from '../constants/theme';

export type CategoryFilterOption = {
  id: string;
  label: string;
};

export interface CategoryFilterChipsProps {
  options: CategoryFilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  accessibilityLabel?: string;
}

/**
 * Horizontal category filter chips — VideoLibrary pattern.
 * Presentational; parent owns selection state and filtered lists.
 */
export default function CategoryFilterChips({
  options,
  selectedId,
  onSelect,
  accessibilityLabel = 'Category filters',
}: CategoryFilterChipsProps) {
  const styles = useThemedStyles(createStyles);

  if (options.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const active = selectedId === option.id;
        return (
          <Pressable
            key={option.id}
            style={[styles.filterChip, active && styles.filterChipActive]}
            onPress={() => onSelect(option.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                styles.filterChipText,
                active && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    filterRow: {
      paddingVertical: spacing.sm,
      gap: spacing.sm,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterChip: {
      minHeight: touchTarget,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.surface,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      marginRight: spacing.sm,
    },
    filterChipActive: {
      backgroundColor: colors.teal,
      borderColor: colors.teal,
    },
    filterChipText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      fontFamily: fontFamilies.semibold,
      fontWeight: fontWeights.semibold,
      color: colors.onPrimary,
    },
  });
}

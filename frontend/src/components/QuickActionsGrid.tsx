import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

export interface QuickActionItem {
  id: string;
  label: string;
  icon?: string;
}

export interface QuickActionsGridProps {
  title?: string;
  actions: QuickActionItem[];
  onActionPress?: (actionId: string) => void;
}

export default function QuickActionsGrid({
  title = 'Quick Actions',
  actions,
  onActionPress,
}: QuickActionsGridProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => onActionPress?.(action.id)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <View
              style={[
                styles.iconWrap,
                action.id === 'sos' && styles.sosIconWrap,
              ]}
            >
              <Text
                style={[styles.icon, action.id === 'sos' && styles.sosIcon]}
              >
                {action.icon ?? action.label.charAt(0)}
              </Text>
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: -spacing.sm,
  },
  item: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    minHeight: 88,
  },
  pressed: {
    opacity: 0.94,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sosIconWrap: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  icon: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    color: colors.tealDeep,
  },
  sosIcon: {
    color: colors.white,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

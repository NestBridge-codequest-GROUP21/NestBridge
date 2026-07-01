import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../constants/theme';

export interface TabBarItem {
  id: string;
  label: string;
  badgeCount?: number;
}

export interface AppTabBarProps {
  items: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function AppTabBar({
  items,
  activeTabId,
  showSosDock = false,
  onSosPress,
  onTabPress,
}: AppTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      {showSosDock && onSosPress ? (
        <View style={styles.sosDock}>
          <Pressable
            style={({ pressed }) => [styles.sosButton, pressed && styles.sosButtonPressed]}
            onPress={onSosPress}
            accessibilityRole="button"
            accessibilityLabel="Emergency SOS"
          >
            <Text style={styles.sosIcon}>🆘</Text>
            <Text style={styles.sosLabel}>SOS</Text>
          </Pressable>
        </View>
      ) : null}
      <View
        style={[
          styles.tabBar,
          { paddingBottom: insets.bottom + layout.tabBarBottomInset },
        ]}
      >
      {items.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <Pressable
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabPress?.(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {tab.badgeCount && tab.badgeCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badgeCount}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sosDock: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    gap: spacing.xs,
  },
  sosButtonPressed: {
    opacity: 0.88,
  },
  sosIcon: {
    fontSize: fontSizes.body,
  },
  sosLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: layout.tabBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    position: 'relative',
  },
  tabLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
  tabLabelActive: {
    fontFamily: fontFamilies.semibold,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: spacing.sm,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: colors.white,
  },
});

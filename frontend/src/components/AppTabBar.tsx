import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SosCircleButton from './SosCircleButton';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
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
  /** When true (and onSosPress set), a raised SOS button sits in the bar center. */
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
  const showSos = showSosDock && !!onSosPress;

  const renderTab = (tab: TabBarItem) => {
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
  };

  const mid = Math.ceil(items.length / 2);
  const leftItems = showSos ? items.slice(0, mid) : items;
  const rightItems = showSos ? items.slice(mid) : [];

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: insets.bottom + layout.tabBarBottomInset },
      ]}
    >
      <View style={styles.tabRow}>
        {leftItems.map(renderTab)}
        {showSos ? (
          <View style={styles.sosSlot} pointerEvents="box-none">
            <View style={styles.sosRaise}>
              <SosCircleButton onPress={onSosPress} />
            </View>
          </View>
        ) : null}
        {rightItems.map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    overflow: 'visible',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.tabBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    position: 'relative',
  },
  sosSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosRaise: {
    marginTop: -layout.sosRaise,
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

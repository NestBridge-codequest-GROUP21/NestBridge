import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon, { type IoniconName } from '../../components/AppIcon';
import type { TransportTab } from '../../data/featureScreensMock';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

const TRANSPORT_MODE_ICONS: IoniconName[] = [
  'bus-outline',
  'car-outline',
  'train-outline',
  'flash-outline',
];

export interface TransportGuideScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  tabs: TransportTab[];
  onBack?: () => void;
}

function RouteCard({
  route,
}: {
  route: TransportTab['routes'][number];
}) {
  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.locationDot} />
        <Text style={styles.routeName}>{route.name}</Text>
      </View>
      <Text style={styles.routeDescription}>{route.description}</Text>
      <View style={styles.fareRow}>
        <Text style={styles.fareLabel}>Fare: {route.fareLabel}</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{route.estimatedPrice}</Text>
          <Text style={styles.priceSubtext}>Est. Fares</Text>
        </View>
      </View>
    </View>
  );
}

export default function TransportGuideScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  tabs,
  onBack,
}: TransportGuideScreenProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '');
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <Text style={styles.screenTitle}>Modes of Transport</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTabId(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.modeIcons}>
          {TRANSPORT_MODE_ICONS.map((iconName) => (
            <View key={iconName} style={styles.modeIconTile}>
              <AppIcon name={iconName} size={24} color={colors.tealDeep} />
            </View>
          ))}
        </View>

        <View style={styles.routeList}>
          {activeTab?.routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tabRow: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  tabLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.white,
  },
  modeIcons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modeIconTile: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeList: {
    gap: spacing.md,
  },
  routeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.success,
  },
  routeName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  routeDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  priceBadge: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  priceSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
});

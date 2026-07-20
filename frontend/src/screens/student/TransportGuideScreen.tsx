import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon, { type IoniconName } from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import SectionHeader from '../../components/SectionHeader';
import type { TransportTab } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  tints,
  iconSizes,
  avatarSizes,
  touchTarget,
  layout,
} from '../../constants/theme';

const MODE_ICON_BY_TAB: Record<string, IoniconName> = {
  trotros: 'bus-outline',
  'shared-taxis': 'car-outline',
  'ride-hailing': 'flash-outline',
};

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
    <Card padding="md">
      <View style={styles.routeHeader}>
        <View style={styles.locationIconWrap}>
          <AppIcon name="location-outline" size={iconSizes.md} color={colors.tealDeep} />
        </View>
        <Text style={styles.routeName}>{route.name}</Text>
      </View>
      <Text style={styles.routeDescription}>{route.description}</Text>
      <View style={styles.fareRow}>
        <Text style={styles.fareLabel}>Typical fare · {route.fareLabel}</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{route.estimatedPrice}</Text>
          <Text style={styles.priceSubtext}>Est. range</Text>
        </View>
      </View>
    </Card>
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
  const routes = activeTab?.routes ?? [];

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
        <SectionHeader
          title="Getting around Ghana"
          subtitle="Trotros, shared taxis, and ride-hailing — what to expect and rough fare ranges."
        />

        {tabs.length === 0 ? (
          <EmptyState
            iconName="bus-outline"
            title="No routes for this city yet"
            body="Trotro, taxi, and ride-hailing guidance will show here when available for your destination."
          />
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}
            >
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const iconName = MODE_ICON_BY_TAB[tab.id] ?? 'bus-outline';
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tabChip, isActive && styles.tabChipActive]}
                    onPress={() => setActiveTabId(tab.id)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={tab.label}
                  >
                    <AppIcon
                      name={iconName}
                      size={iconSizes.md}
                      color={isActive ? colors.white : colors.tealDeep}
                    />
                    <Text
                      style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {routes.length === 0 ? (
              <EmptyState
                iconName="map-outline"
                title="No routes listed"
                body="We don't have sample routes for this mode yet. Try another tab above."
              />
            ) : (
              <View style={styles.routeList}>
                {routes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </View>
            )}
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabRow: {
    gap: spacing.sm,
    marginBottom: layout.sectionGap,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  tabLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.white,
  },
  routeList: {
    gap: spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationIconWrap: {
    width: avatarSizes.sm,
    height: avatarSizes.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeName: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  routeDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: lineHeights.caption,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  fareLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  priceBadge: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    lineHeight: lineHeights.subheading,
  },
  priceSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    lineHeight: lineHeights.caption,
  },
});

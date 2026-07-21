import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
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
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  avatarSizes,
  touchTarget,
  layout,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Card padding="md">
      <View style={styles.routeHeader}>
        <View style={styles.locationIconWrap}>
          <AppIcon name="location-outline" size={iconSizes.md} color={colors.onAccent} />
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const emptyTransport = emptyStates.transport;
  const emptyMode = emptyStates.transportMode;

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
            title={emptyTransport.title}
            body={emptyTransport.body}
            tip={emptyTransport.tip}
            iconGlyph={emptyTransport.iconGlyph}
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
                      color={isActive ? colors.white : colors.onAccent}
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
                title={emptyMode.title}
                body={emptyMode.body}
                tip={emptyMode.tip}
                iconGlyph={emptyMode.iconGlyph}
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

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
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
    backgroundColor: colors.surface,
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
    color: colors.onPrimary,
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
}


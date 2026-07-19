import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import AppIcon from '../../components/AppIcon';
import type { MapLandmark } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../../constants/theme';

export interface OfflineMapScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  regionLabel: string;
  downloadSize: string;
  landmarks: MapLandmark[];
  onLandmarkPress?: (landmarkId: string) => void;
  onLocatePress?: () => void;
  onBack?: () => void;
}

export default function OfflineMapScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  regionLabel,
  downloadSize,
  landmarks,
  onLandmarkPress,
  onLocatePress,
  onBack,
}: OfflineMapScreenProps) {
  const insets = useSafeAreaInsets();
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');

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

      <View style={styles.mapArea}>
        <View style={styles.offlineBanner}>
          <Text style={styles.bannerText}>
            OFFLINE MODE ACTIVE — {regionLabel} ({downloadSize})
          </Text>
        </View>

        <View style={styles.mapCanvas}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 6 }).map((_, row) => (
              <View key={`row-${row}`} style={styles.mapGridRow}>
                {Array.from({ length: 4 }).map((__, col) => (
                  <View key={`cell-${row}-${col}`} style={styles.mapGridCell} />
                ))}
              </View>
            ))}
          </View>

          {landmarks.map((landmark) => (
            <Pressable
              key={landmark.id}
              style={[
                styles.pinWrap,
                { top: `${landmark.topPercent}%`, left: `${landmark.leftPercent}%` },
              ]}
              onPress={() => onLandmarkPress?.(landmark.id)}
              accessibilityRole="button"
              accessibilityLabel={landmark.name}
            >
              <AppIcon name="location" size={fontSizes.subheading} color={colors.danger} />
              <View style={styles.landmarkCard}>
                <View style={styles.landmarkDot} />
                <Text style={styles.landmarkName}>{landmark.name}</Text>
              </View>
            </Pressable>
          ))}

          <View style={styles.currentLocation}>
            <View style={styles.currentDot} />
          </View>

          <Pressable
            style={styles.locateButton}
            onPress={onLocatePress}
            accessibilityRole="button"
            accessibilityLabel="Center on current location"
          >
            <AppIcon name="locate" size={fontSizes.subheading} color={colors.teal} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.searchPanel, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.searchBar}>
          <AppIcon name="search" size={fontSizes.body} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>

        <Text style={styles.routingLabel}>Offline routing between points</Text>

        <View style={styles.routeInputRow}>
          <AppIcon name="location-outline" size={fontSizes.body} color={colors.textSecondary} />
          <TextInput
            style={styles.routeInput}
            placeholder="Route point A"
            placeholderTextColor={colors.textTertiary}
            value={routeFrom}
            onChangeText={setRouteFrom}
          />
        </View>

        <View style={styles.routeInputRow}>
          <AppIcon name="location-outline" size={fontSizes.body} color={colors.textSecondary} />
          <TextInput
            style={styles.routeInput}
            placeholder="Route point B"
            placeholderTextColor={colors.textTertiary}
            value={routeTo}
            onChangeText={setRouteTo}
          />
          <Pressable
            style={styles.routeGoButton}
            accessibilityRole="button"
            accessibilityLabel="Calculate offline route"
          >
            <AppIcon name="arrow-forward" size={fontSizes.subheading} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapArea: {
    flex: 1,
  },
  offlineBanner: {
    backgroundColor: colors.navy,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.sm,
  },
  bannerText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.white,
    textAlign: 'center',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: colors.warmCream,
    margin: layout.screenPaddingHorizontal,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  mapGridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mapGridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
    maxWidth: 120,
  },
  pinIcon: {
    fontSize: fontSizes.subheading,
  },
  landmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  landmarkDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.success,
  },
  landmarkName: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  currentLocation: {
    position: 'absolute',
    top: '48%',
    left: '55%',
    width: 16,
    height: 16,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    borderWidth: 3,
    borderColor: colors.white,
  },
  currentDot: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  searchPanel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchIcon: {
    fontSize: fontSizes.body,
  },
  searchPlaceholder: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textTertiary,
  },
  routingLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  routeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  routePin: {
    fontSize: fontSizes.body,
  },
  routeInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  routeGoButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeGoIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.white,
  },
});

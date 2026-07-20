import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import SearchField from '../../components/SearchField';
import FormTextField from '../../components/FormTextField';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import KeyboardSafeView from '../../components/KeyboardSafeView';
import type { MapLandmark } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  layout,
  shadows,
  lineHeights,
  iconSizes,
  touchTarget,
  controlHeights,
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

const MAP_GRID_ROWS = 6;
const MAP_GRID_COLS = 4;
const LANDMARK_CARD_MAX_WIDTH = layout.listingCardWidth / 2 - spacing.md;
const LOCATION_DOT = spacing.md;
const LOCATION_DOT_BORDER = borderWidths.strong + borderWidths.hairline;

export default function OfflineMapScreen({
  greeting: _greeting,
  userName: _userName,
  userInitials: _userInitials,
  statusIcon: _statusIcon,
  statusLabel: _statusLabel,
  regionLabel,
  downloadSize,
  landmarks,
  onLandmarkPress,
  onLocatePress,
  onBack,
}: OfflineMapScreenProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [landmarkQuery, setLandmarkQuery] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');

  const filteredLandmarks = useMemo(() => {
    const query = landmarkQuery.trim().toLowerCase();
    if (!query) {
      return landmarks;
    }
    return landmarks.filter((landmark) =>
      landmark.name.toLowerCase().includes(query),
    );
  }, [landmarkQuery, landmarks]);

  // Keep the map visible on short phones; panel scrolls for the rest.
  const panelMaxHeight = Math.max(
    controlHeights.lg * 4,
    Math.round(windowHeight * 0.42),
  );

  return (
    <KeyboardSafeView style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Offline map"
        subtitle={`${regionLabel} · ${downloadSize}`}
        compact
        onBack={onBack}
      />

      <View style={styles.mapArea}>
        <View style={styles.offlineBanner}>
          <Text style={styles.bannerText}>
            Offline · {regionLabel} ({downloadSize})
          </Text>
        </View>

        <View style={styles.mapCanvas}>
          <View style={styles.mapGrid}>
            {Array.from({ length: MAP_GRID_ROWS }).map((_, row) => (
              <View key={`row-${row}`} style={styles.mapGridRow}>
                {Array.from({ length: MAP_GRID_COLS }).map((__, col) => (
                  <View key={`cell-${row}-${col}`} style={styles.mapGridCell} />
                ))}
              </View>
            ))}
          </View>

          {filteredLandmarks.map((landmark) => {
            const top = Math.min(88, Math.max(6, landmark.topPercent));
            const left = Math.min(82, Math.max(8, landmark.leftPercent));
            return (
              <Pressable
                key={landmark.id}
                style={[
                  styles.pinWrap,
                  { top: `${top}%`, left: `${left}%` },
                ]}
                onPress={() => onLandmarkPress?.(landmark.id)}
                accessibilityRole="button"
                accessibilityLabel={landmark.name}
              >
                <AppIcon
                  name="location"
                  size={iconSizes.md}
                  color={colors.danger}
                />
                <View style={styles.landmarkCard}>
                  <View style={styles.landmarkDot} />
                  <Text style={styles.landmarkName} numberOfLines={1}>
                    {landmark.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.currentLocation}>
            <View style={styles.currentDot} />
          </View>

          <Pressable
            style={styles.locateButton}
            onPress={onLocatePress}
            accessibilityRole="button"
            accessibilityLabel="Center on current location"
          >
            <AppIcon name="locate" size={iconSizes.md} color={colors.teal} />
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.searchPanel,
          {
            maxHeight: panelMaxHeight,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.panelScrollContent}
        >
          <InlineBanner
            tone="info"
            message="Works without data — useful for first days in Accra or Kumasi."
            style={styles.infoBanner}
          />

          <SearchField
            value={landmarkQuery}
            placeholder="Search landmarks"
            onChangeText={setLandmarkQuery}
            onClear={() => setLandmarkQuery('')}
            style={styles.searchField}
          />

          <Text style={styles.routingLabel}>Plan a route offline</Text>

          <FormTextField
            label="Starting point"
            value={routeFrom}
            placeholder="Starting point"
            onChangeText={setRouteFrom}
          />

          <View style={styles.destinationRow}>
            <View style={styles.destinationField}>
              <FormTextField
                label="Destination"
                value={routeTo}
                placeholder="Destination"
                onChangeText={setRouteTo}
              />
            </View>
            <Pressable
              style={styles.routeGoButton}
              accessibilityRole="button"
              accessibilityLabel="Calculate offline route"
            >
              <AppIcon
                name="arrow-forward"
                size={iconSizes.md}
                color={colors.white}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardSafeView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapArea: {
    flex: 1,
    minHeight: layout.carouselMinHeight,
  },
  offlineBanner: {
    backgroundColor: colors.navy,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.sm,
  },
  bannerText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    textAlign: 'center',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: colors.warmCream,
    margin: layout.screenPaddingHorizontal,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  infoBanner: {
    marginBottom: spacing.md,
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
    borderWidth: borderWidths.hairline / 2,
    borderColor: colors.border,
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
    maxWidth: LANDMARK_CARD_MAX_WIDTH,
    transform: [{ translateX: -spacing.md }],
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
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  landmarkDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.success,
  },
  landmarkName: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  currentLocation: {
    position: 'absolute',
    top: '48%',
    left: '55%',
    width: LOCATION_DOT,
    height: LOCATION_DOT,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    borderWidth: LOCATION_DOT_BORDER,
    borderColor: colors.white,
  },
  currentDot: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: touchTarget,
    height: touchTarget,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
  searchPanel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
  panelScrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  searchField: {
    marginBottom: spacing.md,
  },
  routingLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  destinationField: {
    flex: 1,
  },
  routeGoButton: {
    width: touchTarget,
    height: controlHeights.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

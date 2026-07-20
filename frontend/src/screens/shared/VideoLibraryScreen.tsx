import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  iconSizes,
  touchTarget,
  layout,
  lineHeights,
} from '../../constants/theme';
import type { VideoResourceApi } from '../../services/api';
import { isPlayableYoutubeId } from '../../utils/videoPlayback';
import { emptyStates } from '../../data/appCopy';

export interface VideoLibraryScreenProps {
  cityLabel: string;
  videos: VideoResourceApi[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onVideoPress?: (videoKey: string) => void;
}

export default function VideoLibraryScreen({
  cityLabel,
  videos,
  isLoading = false,
  errorMessage,
  onBack,
  onVideoPress,
}: VideoLibraryScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.videoLibrary(cityLabel);

  const categories = useMemo(() => {
    const set = new Set(videos.map((video) => video.category));
    return ['All', ...Array.from(set)];
  }, [videos]);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? videos
        : videos.filter((video) => video.category === activeCategory),
    [videos, activeCategory],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Video library"
        subtitle={`Orientation and culture for life in ${cityLabel}`}
        compact
        onBack={onBack}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.filterChip,
              activeCategory === category && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(category)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeCategory === category }}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === category && styles.filterChipTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.centered}>
          <SkeletonLoader style={styles.skeleton} />
          <SkeletonLoader style={styles.skeleton} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <InlineBanner tone="error" message={errorMessage} style={styles.errorBanner} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filtered.map((video) => (
            <Pressable
              key={video.id}
              style={({ pressed }) => [styles.cardPress, pressed && styles.pressed]}
              onPress={() => onVideoPress?.(video.videoKey)}
              accessibilityRole="button"
              accessibilityLabel={video.title}
            >
              <Card padding="none" style={styles.card}>
                {video.thumbnailUrl && isPlayableYoutubeId(video.youtubeId) ? (
                  <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <AppIcon
                      name="play-circle"
                      size={iconSizes.xl}
                      color={colors.teal}
                    />
                  </View>
                )}
                <View style={styles.cardBody}>
                  <StatusBadge label={video.category} tone="info" />
                  <Text style={styles.title}>{video.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {video.description}
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  filterRow: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
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
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: fontFamilies.regular,
  },
  filterChipTextActive: {
    color: colors.onPrimary,
    fontWeight: fontWeights.semibold,
  },
  listContent: {
    padding: layout.screenPaddingHorizontal,
    gap: spacing.md,
  },
  cardPress: {
    marginBottom: spacing.md,
  },
  card: {
    overflow: 'hidden',
  },
  pressed: { opacity: 0.92 },
  thumbnail: {
    width: '100%',
    height: layout.carouselMinHeight,
    backgroundColor: colors.warmCream,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: layout.carouselMinHeight,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
  description: {
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    fontFamily: fontFamilies.regular,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  skeleton: {
    alignSelf: 'stretch',
  },
  emptyWrap: {
    flex: 1,
    padding: spacing.lg,
  },
  errorBanner: {
    alignSelf: 'stretch',
  },
});
}


import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';
import type { VideoResourceApi } from '../../services/api';
import { isPlayableYoutubeId } from '../../utils/videoPlayback';

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
        subtitle={`Orientation and culture for ${cityLabel}`}
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
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filtered.map((video) => (
            <Pressable
              key={video.id}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => onVideoPress?.(video.videoKey)}
              accessibilityRole="button"
              accessibilityLabel={video.title}
            >
              {video.thumbnailUrl && isPlayableYoutubeId(video.youtubeId) ? (
                <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.category}>{video.category}</Text>
                <Text style={styles.title}>{video.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {video.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
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
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.92 },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: colors.warmCream,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: fontSizes.display,
    color: colors.teal,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  category: {
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
  title: {
    fontSize: fontSizes.heading,
    color: colors.textPrimary,
    fontWeight: fontWeights.bold,
    fontFamily: fontFamilies.bold,
  },
  description: {
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: fontFamilies.regular,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.body,
    textAlign: 'center',
  },
});

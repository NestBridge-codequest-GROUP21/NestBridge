import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useMemo, useState } from 'react';
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
import SectionHeader from '../../components/SectionHeader';
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
import type { PrimaryIntent } from '../../types/accountProfile';
import {
  EMPTY_VIDEO_PROGRESS,
  VIDEO_HUB_CATEGORIES,
  type VideoProgressState,
} from '../../types/videoLibrary';
import { isPlayableYoutubeId } from '../../utils/videoPlayback';
import {
  buildLearningProgress,
  buildVideoLibrarySections,
  watchStatusLabel,
  type VideoLibraryCardModel,
} from '../../utils/videoLibraryHub';
import { loadVideoProgress } from '../../services/videoProgressStorage';
import { emptyStates } from '../../data/appCopy';

export interface VideoLibraryScreenProps {
  cityLabel: string;
  videos: VideoResourceApi[];
  userId?: string | null;
  viewerIntent?: PrimaryIntent | 'BROWSE' | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onVideoPress?: (videoKey: string) => void;
  /** Bumps when returning from detail so progress reloads. */
  progressRefreshKey?: number;
}

type FilterId = 'all' | 'for-you' | (typeof VIDEO_HUB_CATEGORIES)[number]['id'];

function VideoCard({
  video,
  onPress,
}: {
  video: VideoLibraryCardModel;
  onPress?: (videoKey: string) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const statusLabel = watchStatusLabel(video.watchStatus);
  const statusTone =
    video.watchStatus === 'watched'
      ? 'success'
      : video.watchStatus === 'in_progress'
        ? 'warning'
        : 'neutral';

  return (
    <Pressable
      style={({ pressed }) => [styles.cardPress, pressed && styles.pressed]}
      onPress={() => onPress?.(video.videoKey)}
      accessibilityRole="button"
      accessibilityLabel={`${video.title}. ${statusLabel}`}
    >
      <Card padding="none" elevation="card" style={styles.card}>
        <View style={styles.thumbWrap}>
          {video.thumbnailUrl && isPlayableYoutubeId(video.youtubeId) ? (
            <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <AppIcon name="play-circle" size={iconSizes.xl} color={colors.teal} />
            </View>
          )}
          {video.durationLabel ? (
            <View style={styles.durationPill}>
              <Text style={styles.durationText}>{video.durationLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.cardBody}>
          <View style={styles.metaRow}>
            <StatusBadge label={video.hubCategoryLabel} tone="info" />
            <StatusBadge label={statusLabel} tone={statusTone} />
          </View>
          <Text style={styles.title}>{video.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {video.description}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

export default function VideoLibraryScreen({
  cityLabel,
  videos,
  userId,
  viewerIntent = 'STUDENT',
  isLoading = false,
  errorMessage,
  onBack,
  onVideoPress,
  progressRefreshKey = 0,
}: VideoLibraryScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.videoLibrary(cityLabel);
  const [filter, setFilter] = useState<FilterId>('all');
  const [progress, setProgress] = useState<VideoProgressState>({
    ...EMPTY_VIDEO_PROGRESS,
    startedKeys: [],
    completedKeys: [],
  });

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setProgress({
        ...EMPTY_VIDEO_PROGRESS,
        startedKeys: [],
        completedKeys: [],
      });
      return;
    }
    void loadVideoProgress(userId).then((state) => {
      if (!cancelled) {
        setProgress(state);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId, progressRefreshKey]);

  const sections = useMemo(
    () => buildVideoLibrarySections(videos, viewerIntent, progress),
    [videos, viewerIntent, progress],
  );

  const learning = useMemo(
    () => buildLearningProgress(videos, progress, viewerIntent),
    [videos, progress, viewerIntent],
  );

  const filterOptions: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All topics' },
    { id: 'for-you', label: 'For you' },
    ...VIDEO_HUB_CATEGORIES.map((category) => ({
      id: category.id as FilterId,
      label: category.title.replace(' 🇬🇭', ''),
    })),
  ];

  const visibleSections = useMemo(() => {
    if (filter === 'all') {
      return sections;
    }
    return sections.filter((section) => section.id === filter);
  }, [sections, filter]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Learning hub"
        subtitle={`Curated preparation for life in ${cityLabel}`}
        compact
        onBack={onBack}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingLabel}>Building your learning hub…</Text>
          <SkeletonLoader style={styles.skeleton} lines={3} />
          <SkeletonLoader style={styles.skeleton} lines={2} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <InlineBanner
            tone="error"
            message={errorMessage}
            style={styles.errorBanner}
          />
        </View>
      ) : videos.length === 0 ? (
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
          <Card padding="md" elevation="card" style={styles.progressCard}>
            <Text style={styles.progressEyebrow}>Your learning progress</Text>
            <Text style={styles.progressCount}>
              Videos completed: {learning.completedCount}/{learning.totalCount}
            </Text>
            {learning.recommendedNext ? (
              <Pressable
                style={({ pressed }) => [
                  styles.nextRow,
                  pressed && styles.pressed,
                ]}
                onPress={() =>
                  onVideoPress?.(learning.recommendedNext!.videoKey)
                }
                accessibilityRole="button"
                accessibilityLabel={`Recommended next: ${learning.recommendedNext.title}`}
              >
                <View style={styles.nextText}>
                  <Text style={styles.nextLabel}>Recommended next</Text>
                  <Text style={styles.nextTitle} numberOfLines={2}>
                    {learning.recommendedNext.title}
                  </Text>
                </View>
                <AppIcon
                  name="play-circle"
                  size={iconSizes.lg}
                  color={colors.teal}
                />
              </Pressable>
            ) : (
              <Text style={styles.progressDone}>
                You have completed this preparation set. Revisit any topic anytime.
              </Text>
            )}
          </Card>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filterOptions.map((option) => {
              const active = filter === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[
                    styles.filterChip,
                    active && styles.filterChipActive,
                  ]}
                  onPress={() => setFilter(option.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.filterChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {visibleSections.length === 0 ? (
            <EmptyState
              title={empty.title}
              body={empty.body}
              tip={empty.tip}
              iconGlyph={empty.iconGlyph}
            />
          ) : (
            visibleSections.map((section) => (
              <View key={section.id} style={styles.section}>
                <SectionHeader
                  title={section.title}
                  subtitle={section.subtitle}
                />
                {section.videos.map((video) => (
                  <VideoCard
                    key={video.videoKey}
                    video={video}
                    onPress={onVideoPress}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    listContent: {
      paddingHorizontal: layout.screenPaddingHorizontal,
      paddingBottom: spacing.xl,
    },
    progressCard: {
      marginTop: spacing.md,
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    progressEyebrow: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    progressCount: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    progressDone: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
    },
    nextRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: touchTarget,
      paddingTop: spacing.sm,
      borderTopWidth: borderWidths.hairline,
      borderTopColor: colors.border,
    },
    nextText: {
      flex: 1,
      gap: spacing.xs,
    },
    nextLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textSecondary,
    },
    nextTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.onAccent,
    },
    filterRow: {
      paddingVertical: spacing.sm,
      gap: spacing.sm,
      marginBottom: spacing.md,
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
    section: {
      marginBottom: spacing.lg,
    },
    cardPress: {
      marginBottom: spacing.md,
    },
    card: {
      overflow: 'hidden',
    },
    pressed: { opacity: 0.92 },
    thumbWrap: {
      position: 'relative',
    },
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
    durationPill: {
      position: 'absolute',
      right: spacing.sm,
      bottom: spacing.sm,
      backgroundColor: colors.navy,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    durationText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.onPrimary,
    },
    cardBody: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    title: {
      fontSize: fontSizes.subheading,
      lineHeight: lineHeights.subheading,
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
    loadingLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
      alignSelf: 'flex-start',
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

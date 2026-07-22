import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import SecondaryButton from '../../components/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  layout,
} from '../../constants/theme';
import type { VideoResourceApi } from '../../services/api';
import { isPlayableYoutubeId } from '../../utils/videoPlayback';
import type { VideoWatchStatus } from '../../types/videoLibrary';
import { watchStatusLabel } from '../../utils/videoLibraryHub';

export interface VideoDetailScreenProps {
  video: VideoResourceApi | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  watchStatus?: VideoWatchStatus;
  hubCategoryLabel?: string;
  durationLabel?: string;
  onBack?: () => void;
  onRetry?: () => void;
  onMarkComplete?: () => void;
  onStarted?: () => void;
}

export default function VideoDetailScreen({
  video,
  isLoading = false,
  errorMessage,
  watchStatus = 'unwatched',
  hubCategoryLabel,
  durationLabel,
  onBack,
  onRetry,
  onMarkComplete,
  onStarted,
}: VideoDetailScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  useEffect(() => {
    if (video && isPlayableYoutubeId(video.youtubeId)) {
      onStarted?.();
    }
    // Intentionally run once per opened lesson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.videoKey]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loadingLabel}>Loading lesson…</Text>
        <SkeletonLoader style={styles.skeleton} lines={4} />
      </View>
    );
  }

  if (errorMessage || !video) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScreenHeader title="Lesson unavailable" compact onBack={onBack} />
        <View style={styles.errorBody}>
          <EmptyState
            title="This lesson could not be opened"
            body={
              errorMessage ??
              'The clip is temporarily unavailable. Pick another title from the learning hub.'
            }
            tip="Your progress is saved — continue with the recommended next video."
            iconName="film-outline"
            primaryActionLabel={onRetry ? 'Try again' : undefined}
            onPrimaryAction={onRetry}
          />
        </View>
      </View>
    );
  }

  const canPlay = isPlayableYoutubeId(video.youtubeId);
  const playerBackground = colors.navy;
  const categoryLabel = hubCategoryLabel ?? video.category;
  const statusTone =
    watchStatus === 'watched'
      ? 'success'
      : watchStatus === 'in_progress'
        ? 'warning'
        : 'neutral';
  const embedHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: ${playerBackground}; height: 100%; overflow: hidden; }
      iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="https://www.youtube.com/embed/${video.youtubeId}?playsinline=1&rel=0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
    ></iframe>
  </body>
</html>`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title={video.title}
        subtitle={categoryLabel}
        compact
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.playerWrap}>
          {canPlay ? (
            <WebView
              source={{
                html: embedHtml,
                baseUrl: 'https://nestbridge.app',
              }}
              style={styles.player}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
            />
          ) : (
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonTitle}>Video unavailable</Text>
              <Text style={styles.comingSoonBody}>
                This clip could not be loaded. Pick another title from the learning hub.
              </Text>
              {onRetry ? (
                <SecondaryButton label="Try again" onPress={onRetry} />
              ) : null}
            </View>
          )}
        </View>
        <Card style={styles.body} padding="lg">
          <View style={styles.badgeRow}>
            <StatusBadge label={categoryLabel} tone="info" />
            <StatusBadge label={watchStatusLabel(watchStatus)} tone={statusTone} />
            {durationLabel ? (
              <StatusBadge label={durationLabel} tone="neutral" />
            ) : null}
          </View>
          <Text style={styles.description}>{video.description}</Text>
          <Text style={styles.meta}>
            Curated preparation for settling into {video.city}
          </Text>
          {watchStatus !== 'watched' && onMarkComplete ? (
            <PrimaryButton
              label="Mark as watched"
              onPress={onMarkComplete}
              style={styles.completeButton}
            />
          ) : null}
        </Card>
      </ScrollView>
    </View>
  );
}

function createStyles({ colors, shadows }: AppTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: layout.screenPaddingHorizontal,
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
    content: {
      paddingBottom: spacing.xl,
    },
    playerWrap: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: colors.navy,
      ...shadows.card,
    },
    player: {
      flex: 1,
      backgroundColor: colors.navy,
    },
    comingSoon: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.navy,
      gap: spacing.md,
    },
    comingSoonTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.subheading,
      color: colors.onPrimary,
      textAlign: 'center',
    },
    comingSoonBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.border,
      textAlign: 'center',
      lineHeight: lineHeights.caption,
    },
    body: {
      margin: layout.screenPaddingHorizontal,
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    description: {
      fontSize: fontSizes.body,
      color: colors.textPrimary,
      lineHeight: lineHeights.body,
      fontFamily: fontFamilies.regular,
    },
    meta: {
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      fontFamily: fontFamilies.regular,
      marginTop: spacing.sm,
    },
    completeButton: {
      marginTop: spacing.md,
    },
    errorBody: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.lg,
    },
  });
}

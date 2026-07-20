import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import SecondaryButton from '../../components/SecondaryButton';
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

export interface VideoDetailScreenProps {
  video: VideoResourceApi | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onRetry?: () => void;
}

export default function VideoDetailScreen({
  video,
  isLoading = false,
  errorMessage,
  onBack,
  onRetry,
}: VideoDetailScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  if (isLoading) {
    return (
      <View style={styles.loader}>
        <SkeletonLoader style={styles.skeleton} lines={4} />
      </View>
    );
  }

  if (errorMessage || !video) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScreenHeader title="Video unavailable" compact onBack={onBack} />
        <View style={styles.errorBody}>
          <EmptyState
            title="Could not load video"
            body={errorMessage ?? 'This orientation clip is unavailable right now.'}
            tip="Try another title from the library, or check your connection."
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
      <ScreenHeader title={video.title} subtitle={video.category} compact onBack={onBack} />
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
                This clip could not be loaded. Pick another title from the library.
              </Text>
              {onRetry ? (
                <SecondaryButton label="Try again" onPress={onRetry} />
              ) : null}
            </View>
          )}
        </View>
        <Card style={styles.body} padding="lg">
          <StatusBadge label={video.category} tone="info" style={styles.badge} />
          <Text style={styles.description}>{video.description}</Text>
          <Text style={styles.meta}>Curated for settling into {video.city}</Text>
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
    color: colors.white,
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
  badge: {
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
  errorBody: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
}


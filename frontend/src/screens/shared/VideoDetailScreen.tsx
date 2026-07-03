import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
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
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  if (errorMessage || !video) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScreenHeader title="Video unavailable" compact onBack={onBack} />
        <View style={styles.errorBody}>
          <Text style={styles.errorMessage}>
            {errorMessage ?? 'We could not load this video.'}
          </Text>
          {onRetry ? (
            <Pressable
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              onPress={onRetry}
              accessibilityRole="button"
              accessibilityLabel="Try again"
            >
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?playsinline=1`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader title={video.title} subtitle={video.category} compact onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.playerWrap}>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.player}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.description}>{video.description}</Text>
          <Text style={styles.meta}>Curated for {video.city}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.textPrimary,
  },
  player: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  description: {
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    lineHeight: 24,
    fontFamily: fontFamilies.regular,
  },
  meta: {
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: fontFamilies.regular,
  },
  errorBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  errorMessage: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.88,
  },
});

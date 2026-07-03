import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
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
}

export default function VideoDetailScreen({
  video,
  isLoading = false,
  errorMessage,
  onBack,
}: VideoDetailScreenProps) {
  if (isLoading || !video) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?playsinline=1`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader title={video.title} subtitle={video.category} compact onBack={onBack} />
      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
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
  errorBanner: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.white,
    fontSize: fontSizes.caption,
  },
});

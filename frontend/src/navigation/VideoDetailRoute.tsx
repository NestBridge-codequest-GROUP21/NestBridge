import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import VideoDetailScreen from '../screens/shared/VideoDetailScreen';
import { useVideo } from '../hooks/useContent';
import { colors } from '../constants/theme';

export interface VideoDetailRouteProps {
  videoKey: string;
  onBack?: () => void;
}

export default function VideoDetailRoute({ videoKey, onBack }: VideoDetailRouteProps) {
  const videoApi = useVideo(videoKey, !!videoKey);

  return (
    <VideoDetailScreen
      video={videoApi.data}
      isLoading={videoApi.isLoading}
      errorMessage={videoApi.error}
      onBack={onBack}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

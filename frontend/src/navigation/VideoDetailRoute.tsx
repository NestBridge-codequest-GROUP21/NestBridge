import React from 'react';
import VideoDetailScreen from '../screens/shared/VideoDetailScreen';
import { useVideo } from '../hooks/useContent';

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
      onRetry={() => videoApi.refresh()}
    />
  );
}

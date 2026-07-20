import React, { useMemo } from 'react';
import VideoDetailScreen from '../screens/shared/VideoDetailScreen';
import { useVideo } from '../hooks/useContent';
import { videosApiMock } from '../data/contentLibraryMock';
import { sanitizeVideoResource } from '../utils/videoPlayback';

export interface VideoDetailRouteProps {
  videoKey: string;
  onBack?: () => void;
}

export default function VideoDetailRoute({ videoKey, onBack }: VideoDetailRouteProps) {
  const videoApi = useVideo(videoKey, !!videoKey);

  const video = useMemo(() => {
    if (videoApi.data) {
      return sanitizeVideoResource(videoApi.data);
    }
    const fallback = videosApiMock.find((item) => item.videoKey === videoKey);
    return fallback ? sanitizeVideoResource(fallback) : null;
  }, [videoApi.data, videoKey]);

  return (
    <VideoDetailScreen
      video={video}
      isLoading={videoApi.isLoading && !video}
      errorMessage={video ? null : videoApi.error}
      onBack={onBack}
      onRetry={() => videoApi.refresh()}
    />
  );
}

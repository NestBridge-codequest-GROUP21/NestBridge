import React, { useEffect, useMemo, useState } from 'react';
import VideoDetailScreen from '../screens/shared/VideoDetailScreen';
import { useVideo } from '../hooks/useContent';
import { videosApiMock } from '../data/contentLibraryMock';
import { sanitizeVideoResource } from '../utils/videoPlayback';
import {
  markVideoCompleted,
  markVideoStarted,
  loadVideoProgress,
} from '../services/videoProgressStorage';
import {
  EMPTY_VIDEO_PROGRESS,
  type VideoProgressState,
  type VideoWatchStatus,
} from '../types/videoLibrary';
import { toVideoLibraryCard } from '../utils/videoLibraryHub';
import { shouldUseDemoFallbackForAccount } from '../config/demoMode';
import { useAuth } from '../context/AuthContext';

export interface VideoDetailRouteProps {
  videoKey: string;
  userId?: string | null;
  onBack?: () => void;
  onProgressChanged?: () => void;
}

function statusFromProgress(
  videoKey: string,
  progress: VideoProgressState,
): VideoWatchStatus {
  if (progress.completedKeys.includes(videoKey)) {
    return 'watched';
  }
  if (progress.startedKeys.includes(videoKey)) {
    return 'in_progress';
  }
  return 'unwatched';
}

export default function VideoDetailRoute({
  videoKey,
  userId,
  onBack,
  onProgressChanged,
}: VideoDetailRouteProps) {
  const { user } = useAuth();
  const demoFallbackEnabled = shouldUseDemoFallbackForAccount(user?.email);
  const videoApi = useVideo(videoKey, !!videoKey);
  const [progress, setProgress] = useState<VideoProgressState>({
    ...EMPTY_VIDEO_PROGRESS,
    startedKeys: [],
    completedKeys: [],
  });

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
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
  }, [userId, videoKey]);

  const video = useMemo(() => {
    if (videoApi.data) {
      return sanitizeVideoResource(videoApi.data);
    }
    if (!demoFallbackEnabled) {
      return null;
    }
    const fallback = videosApiMock.find((item) => item.videoKey === videoKey);
    return fallback ? sanitizeVideoResource(fallback) : null;
  }, [videoApi.data, videoKey, demoFallbackEnabled]);

  const card = useMemo(
    () => (video ? toVideoLibraryCard(video, progress) : null),
    [video, progress],
  );

  return (
    <VideoDetailScreen
      video={video}
      isLoading={videoApi.isLoading && !video}
      errorMessage={video ? null : videoApi.error}
      watchStatus={statusFromProgress(videoKey, progress)}
      hubCategoryLabel={card?.hubCategoryLabel}
      durationLabel={card?.durationLabel}
      onBack={onBack}
      onRetry={() => videoApi.refresh()}
      onStarted={() => {
        if (!userId || !videoKey) {
          return;
        }
        void markVideoStarted(userId, videoKey).then((state) => {
          setProgress(state);
          onProgressChanged?.();
        });
      }}
      onMarkComplete={() => {
        if (!userId || !videoKey) {
          return;
        }
        void markVideoCompleted(userId, videoKey).then((state) => {
          setProgress(state);
          onProgressChanged?.();
        });
      }}
    />
  );
}

import * as SecureStore from 'expo-secure-store';
import {
  EMPTY_VIDEO_PROGRESS,
  type VideoProgressState,
} from '../types/videoLibrary';

function progressKey(userId: string): string {
  return `nestbridge.videoProgress.${userId}`;
}

function normalize(state: Partial<VideoProgressState> | null): VideoProgressState {
  return {
    startedKeys: Array.isArray(state?.startedKeys)
      ? [...new Set(state!.startedKeys.filter(Boolean))]
      : [],
    completedKeys: Array.isArray(state?.completedKeys)
      ? [...new Set(state!.completedKeys.filter(Boolean))]
      : [],
  };
}

export async function loadVideoProgress(
  userId: string,
): Promise<VideoProgressState> {
  try {
    const raw = await SecureStore.getItemAsync(progressKey(userId));
    if (!raw) {
      return { ...EMPTY_VIDEO_PROGRESS, startedKeys: [], completedKeys: [] };
    }
    return normalize(JSON.parse(raw) as Partial<VideoProgressState>);
  } catch {
    return { ...EMPTY_VIDEO_PROGRESS, startedKeys: [], completedKeys: [] };
  }
}

export async function saveVideoProgress(
  userId: string,
  state: VideoProgressState,
): Promise<void> {
  await SecureStore.setItemAsync(
    progressKey(userId),
    JSON.stringify(normalize(state)),
  );
}

export async function markVideoStarted(
  userId: string,
  videoKey: string,
): Promise<VideoProgressState> {
  const current = await loadVideoProgress(userId);
  if (
    current.startedKeys.includes(videoKey) ||
    current.completedKeys.includes(videoKey)
  ) {
    return current;
  }
  const next = {
    ...current,
    startedKeys: [...current.startedKeys, videoKey],
  };
  await saveVideoProgress(userId, next);
  return next;
}

export async function markVideoCompleted(
  userId: string,
  videoKey: string,
): Promise<VideoProgressState> {
  const current = await loadVideoProgress(userId);
  const startedKeys = current.startedKeys.includes(videoKey)
    ? current.startedKeys
    : [...current.startedKeys, videoKey];
  const completedKeys = current.completedKeys.includes(videoKey)
    ? current.completedKeys
    : [...current.completedKeys, videoKey];
  const next = { startedKeys, completedKeys };
  await saveVideoProgress(userId, next);
  return next;
}

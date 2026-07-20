import { videosApiMock } from '../data/contentLibraryMock';
import type { VideoResourceApi } from '../services/api';

/** Sentinel used in mock/seed data until NestBridge publishes real videos. */
export const VIDEO_COMING_SOON_ID = 'pending';

/** Known meme / unrelated IDs that must never play in NestBridge. */
const BLOCKED_YOUTUBE_IDS = new Set([
  'dQw4w9WgXcQ', // Rick Astley
  'ScMzIvxBSi4',
  'jNQXAC9IVRw', // Me at the zoo
  'M7lc1UVf-VE', // YouTube iframe API demo
  'kJQP7kiw5Fk', // Despacito
  'L_jWHffIxHc',
  'L_jWHffI5Hc',
]);

const CURATED_BY_KEY = new Map(
  videosApiMock.map((video) => [video.videoKey, video] as const),
);

/** YouTube video ids are 11 chars; anything else is treated as not playable. */
export function isPlayableYoutubeId(youtubeId: string | null | undefined): boolean {
  if (!youtubeId) {
    return false;
  }
  if (youtubeId === VIDEO_COMING_SOON_ID) {
    return false;
  }
  if (BLOCKED_YOUTUBE_IDS.has(youtubeId)) {
    return false;
  }
  return /^[\w-]{11}$/.test(youtubeId);
}

/**
 * Prefer curated Ghana video metadata by videoKey whenever the API returns
 * blocked, missing, or mismatched playback IDs (common on stale DBs).
 */
export function sanitizeVideoResource(video: VideoResourceApi): VideoResourceApi {
  const curated = CURATED_BY_KEY.get(video.videoKey);
  if (!curated) {
    if (!isPlayableYoutubeId(video.youtubeId)) {
      return {
        ...video,
        youtubeId: VIDEO_COMING_SOON_ID,
        thumbnailUrl: '',
      };
    }
    return video;
  }

  // Always use curated Ghana playback for known keys so stale/blocked DB
  // rows (rickrolls, meme clips) cannot surface in the app.
  return {
    ...video,
    title: curated.title,
    description: curated.description,
    category: curated.category,
    youtubeId: curated.youtubeId,
    thumbnailUrl: curated.thumbnailUrl,
  };
}

export function sanitizeVideoResources(videos: VideoResourceApi[]): VideoResourceApi[] {
  return videos.map(sanitizeVideoResource);
}

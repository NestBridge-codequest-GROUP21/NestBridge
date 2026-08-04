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

/** Poster image while the YouTube embed boots (avoids a blank navy frame). */
export function youtubeThumbnailUrl(youtubeId: string | null | undefined): string | null {
  if (!isPlayableYoutubeId(youtubeId) || !youtubeId) {
    return null;
  }
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
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

/**
 * Sanitize, drop non-playable placeholders, and keep one entry per YouTube ID
 * (and per videoKey) so API + demo merge never shows the same clip twice.
 */
export function sanitizeVideoResources(videos: VideoResourceApi[]): VideoResourceApi[] {
  const seenYoutubeIds = new Set<string>();
  const seenKeys = new Set<string>();
  const unique: VideoResourceApi[] = [];

  for (const raw of videos) {
    const video = sanitizeVideoResource(raw);
    if (!isPlayableYoutubeId(video.youtubeId)) {
      continue;
    }
    const yt = video.youtubeId.trim();
    const key = video.videoKey.trim().toLowerCase();
    if (seenYoutubeIds.has(yt) || (key && seenKeys.has(key))) {
      continue;
    }
    seenYoutubeIds.add(yt);
    if (key) {
      seenKeys.add(key);
    }
    unique.push(video);
  }

  // Prefer curated order when present, then any remaining API-only rows.
  const curatedOrder = new Map(
    videosApiMock.map((item, index) => [item.videoKey, index] as const),
  );
  unique.sort((a, b) => {
    const ai = curatedOrder.get(a.videoKey);
    const bi = curatedOrder.get(b.videoKey);
    if (ai != null && bi != null) {
      return ai - bi;
    }
    if (ai != null) {
      return -1;
    }
    if (bi != null) {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });

  return unique;
}

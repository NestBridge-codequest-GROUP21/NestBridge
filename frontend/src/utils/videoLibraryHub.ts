import type { PrimaryIntent } from '../types/accountProfile';
import type { VideoResourceApi } from '../services/api';
import {
  VIDEO_HUB_CATEGORIES,
  type VideoHubCategoryId,
  type VideoProgressState,
  type VideoWatchStatus,
} from '../types/videoLibrary';

export interface VideoLibraryCardModel extends VideoResourceApi {
  hubCategoryId: VideoHubCategoryId;
  hubCategoryLabel: string;
  durationLabel?: string;
  watchStatus: VideoWatchStatus;
  topicTags: string[];
}

export interface VideoLibrarySection {
  id: VideoHubCategoryId | 'for-you';
  title: string;
  subtitle: string;
  videos: VideoLibraryCardModel[];
}

export interface VideoLearningProgress {
  completedCount: number;
  totalCount: number;
  recommendedNext: VideoLibraryCardModel | null;
}

/** Map raw / legacy categories and keys into hub sections. */
const KEY_TO_HUB: Record<string, VideoHubCategoryId> = {
  'arrival-tips': 'preparing',
  'evisa-guide': 'preparing',
  'ghana-safety': 'preparing',
  'accra-orientation': 'living',
  'trotro-safety': 'living',
  'accra-getting-around': 'living',
  'momo-app': 'living',
  'homestay-etiquette': 'culture',
  'twi-basics': 'culture',
  'market-tips': 'exploring',
  'food-intro': 'exploring',
  'cape-coast-heritage': 'exploring',
  'homowo-festival': 'exploring',
};

const CATEGORY_TO_HUB: Record<string, VideoHubCategoryId> = {
  Orientation: 'preparing',
  Visas: 'preparing',
  Safety: 'preparing',
  Accommodation: 'living',
  Transport: 'living',
  'Mobile Money': 'living',
  Etiquette: 'culture',
  Language: 'culture',
  Culture: 'culture',
  Food: 'exploring',
  Festivals: 'exploring',
};

const DURATION_BY_KEY: Record<string, string> = {
  'arrival-tips': '12 min',
  'evisa-guide': '8 min',
  'accra-orientation': '10 min',
  'trotro-safety': '7 min',
  'accra-getting-around': '9 min',
  'homestay-etiquette': '11 min',
  'market-tips': '8 min',
  'food-intro': '6 min',
  'twi-basics': '10 min',
  'momo-app': '9 min',
  'ghana-safety': '8 min',
  'cape-coast-heritage': '14 min',
  'homowo-festival': '7 min',
};

const TOPIC_BY_KEY: Record<string, string[]> = {
  'arrival-tips': ['arrival', 'airport', 'money', 'visa'],
  'evisa-guide': ['visa'],
  'accra-orientation': ['neighborhoods', 'accommodation', 'campus'],
  'trotro-safety': ['transport'],
  'accra-getting-around': ['transport', 'neighborhoods'],
  'homestay-etiquette': ['etiquette', 'greetings', 'culture'],
  'market-tips': ['food'],
  'food-intro': ['food'],
  'twi-basics': ['twi', 'greetings'],
  'momo-app': ['mobile money', 'money'],
  'ghana-safety': ['safety', 'arrival'],
  'cape-coast-heritage': ['attractions', 'heritage'],
  'homowo-festival': ['festivals', 'heritage'],
};

const STUDENT_TOPICS = [
  'campus',
  'accommodation',
  'neighborhoods',
  'transport',
  'money',
  'mobile money',
  'arrival',
];

const TOURIST_TOPICS = [
  'attractions',
  'heritage',
  'culture',
  'etiquette',
  'food',
  'festivals',
  'safety',
];

function hubCategoryIdFor(video: VideoResourceApi): VideoHubCategoryId {
  return (
    KEY_TO_HUB[video.videoKey] ??
    CATEGORY_TO_HUB[video.category] ??
    'exploring'
  );
}

function hubLabel(id: VideoHubCategoryId): string {
  return (
    VIDEO_HUB_CATEGORIES.find((category) => category.id === id)?.title ?? id
  );
}

function watchStatusFor(
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

function topicScore(video: VideoResourceApi, topics: string[]): number {
  const tags = TOPIC_BY_KEY[video.videoKey] ?? [];
  const haystack = `${video.title} ${video.description} ${video.category} ${tags.join(' ')}`.toLowerCase();
  return topics.reduce(
    (score, topic) => (haystack.includes(topic.toLowerCase()) ? score + 1 : score),
    0,
  );
}

export function toVideoLibraryCard(
  video: VideoResourceApi,
  progress: VideoProgressState,
): VideoLibraryCardModel {
  const hubCategoryId = hubCategoryIdFor(video);
  return {
    ...video,
    hubCategoryId,
    hubCategoryLabel: hubLabel(hubCategoryId),
    durationLabel: DURATION_BY_KEY[video.videoKey],
    watchStatus: watchStatusFor(video.videoKey, progress),
    topicTags: TOPIC_BY_KEY[video.videoKey] ?? [],
  };
}

export function buildPersonalizedRecommendations(
  videos: VideoResourceApi[],
  intent: PrimaryIntent | 'BROWSE' | null | undefined,
  progress: VideoProgressState,
  limit = 4,
): VideoLibraryCardModel[] {
  const topics =
    intent === 'TOURIST' || intent === 'BROWSE' ? TOURIST_TOPICS : STUDENT_TOPICS;

  const ranked = [...videos]
    .map((video) => ({
      video,
      score: topicScore(video, topics),
      hub: hubCategoryIdFor(video),
    }))
    .sort((a, b) => {
      const aDone = progress.completedKeys.includes(a.video.videoKey) ? 1 : 0;
      const bDone = progress.completedKeys.includes(b.video.videoKey) ? 1 : 0;
      if (aDone !== bDone) {
        return aDone - bDone;
      }
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const aStarted = progress.startedKeys.includes(a.video.videoKey) ? 0 : 1;
      const bStarted = progress.startedKeys.includes(b.video.videoKey) ? 0 : 1;
      if (aStarted !== bStarted) {
        return aStarted - bStarted;
      }
      return a.hub.localeCompare(b.hub);
    });

  const seen = new Set<string>();
  const picks: VideoLibraryCardModel[] = [];
  // Prefer scored matches first, then fill from remaining unwatched so For you
  // is never identical to the full All topics library.
  for (const preferScored of [true, false]) {
    for (const entry of ranked) {
      if (preferScored && entry.score <= 0) {
        continue;
      }
      if (!preferScored && entry.score > 0) {
        continue;
      }
      const key = entry.video.videoKey;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      picks.push(toVideoLibraryCard(entry.video, progress));
      if (picks.length >= limit) {
        return picks;
      }
    }
  }
  return picks;
}

export function buildVideoLibrarySections(
  videos: VideoResourceApi[],
  intent: PrimaryIntent | 'BROWSE' | null | undefined,
  progress: VideoProgressState,
): VideoLibrarySection[] {
  const cards = videos.map((video) => toVideoLibraryCard(video, progress));
  const forYou = buildPersonalizedRecommendations(videos, intent, progress);
  const sections: VideoLibrarySection[] = [];
  if (forYou.length > 0) {
    sections.push({
      id: 'for-you',
      title:
        intent === 'TOURIST' || intent === 'BROWSE'
          ? 'Recommended for your trip'
          : 'Recommended for your studies',
      subtitle:
        intent === 'TOURIST' || intent === 'BROWSE'
          ? 'Attractions, culture, food, and safety first'
          : 'Campus life, stays, transport, and money basics',
      videos: forYou,
    });
  }

  for (const category of VIDEO_HUB_CATEGORIES) {
    const categoryVideos = cards.filter(
      (video) => video.hubCategoryId === category.id,
    );
    if (categoryVideos.length === 0) {
      continue;
    }
    sections.push({
      id: category.id,
      title: category.title,
      subtitle: category.subtitle,
      videos: categoryVideos,
    });
  }

  return sections;
}

export function buildLearningProgress(
  videos: VideoResourceApi[],
  progress: VideoProgressState,
  intent: PrimaryIntent | 'BROWSE' | null | undefined,
): VideoLearningProgress {
  const totalCount = videos.length;
  const completedCount = videos.filter((video) =>
    progress.completedKeys.includes(video.videoKey),
  ).length;

  const personalized = buildPersonalizedRecommendations(
    videos,
    intent,
    progress,
    videos.length,
  );
  const recommendedNext =
    personalized.find((video) => video.watchStatus !== 'watched') ??
    videos
      .map((video) => toVideoLibraryCard(video, progress))
      .find((video) => video.watchStatus !== 'watched') ??
    null;

  return { completedCount, totalCount, recommendedNext };
}

export function watchStatusLabel(status: VideoWatchStatus): string {
  switch (status) {
    case 'watched':
      return '✓ Watched';
    case 'in_progress':
      return 'Continue watching';
    default:
      return 'Not started';
  }
}

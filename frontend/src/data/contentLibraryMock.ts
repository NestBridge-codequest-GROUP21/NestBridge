import type {
  ChecklistItemApi,
  MapLandmarkApi,
  PhraseApi,
  TopicApi,
  TouristSiteApi,
  TransportTabApi,
  VideoResourceApi,
} from '../services/api';
import {
  localTipsPhrasesMock,
  localTipsTopicsMock,
  offlineMapLandmarksMock,
  prepChecklistMock,
  transportTabsMock,
} from './featureScreensMock';
import { touristSitesMock } from './touristSitesMock';

function youtubeThumb(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export const phrasesApiMock: PhraseApi[] = localTipsPhrasesMock.map((item) => ({
  id: item.id,
  emoji: item.emoji,
  phrase: item.phrase,
  translation: item.translation,
  hasAudio: item.hasAudio,
}));

export const topicsApiMock: TopicApi[] = localTipsTopicsMock.map((item) => ({
  id: item.id,
  emoji: item.emoji,
  title: item.title,
  description: item.description,
}));

export const transportApiMock: TransportTabApi[] = transportTabsMock.map((tab) => ({
  id: tab.id,
  label: tab.label,
  routes: tab.routes.map((route) => ({
    id: route.id,
    name: route.name,
    description: route.description,
    fareLabel: route.fareLabel,
    estimatedPrice: route.estimatedPrice,
  })),
}));

export const sitesApiMock: TouristSiteApi[] = touristSitesMock.map((site) => ({
  id: site.id,
  siteKey: site.id,
  name: site.name,
  city: site.city,
  description: site.description,
  openingHours: site.openingHours,
  admission: site.admission,
}));

export const checklistApiMock: ChecklistItemApi[] = prepChecklistMock.map((task) => ({
  id: task.id,
  itemKey: task.id,
  label: task.label,
}));

export const landmarksApiMock: MapLandmarkApi[] = offlineMapLandmarksMock.map((landmark) => ({
  id: landmark.id,
  name: landmark.name,
  topPercent: landmark.topPercent,
  leftPercent: landmark.leftPercent,
}));

/** Ghana relocation / Accra orientation videos (public YouTube embeds). */
export const videosApiMock: VideoResourceApi[] = [
  {
    id: 'video-arrival',
    videoKey: 'arrival-tips',
    title: 'Arriving in Ghana — What to Expect',
    description:
      'Visa, SIM cards, money, safety, and practical tips before you land at Kotoka.',
    category: 'Orientation',
    youtubeId: 'ejJcat0HzQQ',
    thumbnailUrl: youtubeThumb('ejJcat0HzQQ'),
    city: 'Accra',
  },
  {
    id: 'video-trotro',
    videoKey: 'trotro-safety',
    title: 'Getting Around Accra',
    description:
      'Neighborhoods, landmarks, and how visitors move through Ghana’s capital.',
    category: 'Transport',
    youtubeId: '7-VI47c0Q4A',
    thumbnailUrl: youtubeThumb('7-VI47c0Q4A'),
    city: 'Accra',
  },
  {
    id: 'video-homestay',
    videoKey: 'homestay-etiquette',
    title: 'Accra Culture, Food & Safety Tips',
    description:
      'First-trip culture notes, food moments, and safety awareness for visitors.',
    category: 'Culture',
    youtubeId: 'Gjd_rKh5o64',
    thumbnailUrl: youtubeThumb('Gjd_rKh5o64'),
    city: 'Accra',
  },
  {
    id: 'video-accra',
    videoKey: 'accra-orientation',
    title: 'Accra Neighborhood Guide',
    description:
      'Black Star Square, Jamestown, and getting oriented in the capital.',
    category: 'Orientation',
    youtubeId: '8JLOminF2Do',
    thumbnailUrl: youtubeThumb('8JLOminF2Do'),
    city: 'Accra',
  },
  {
    id: 'video-market',
    videoKey: 'market-tips',
    title: 'Street Food & Markets in Accra',
    description:
      'Chop-bar lunch and West African food markets — useful before you explore with hosts.',
    category: 'Culture',
    youtubeId: 'YvlYjLPgrCE',
    thumbnailUrl: youtubeThumb('YvlYjLPgrCE'),
    city: 'Accra',
  },
  {
    id: 'video-food',
    videoKey: 'food-intro',
    title: 'Introduction to Ghanaian Food',
    description: 'Must-try Accra dishes — jollof, banku, and local favorites.',
    category: 'Food',
    youtubeId: 'Yk4cpG1BOHg',
    thumbnailUrl: youtubeThumb('Yk4cpG1BOHg'),
    city: 'Accra',
  },
];

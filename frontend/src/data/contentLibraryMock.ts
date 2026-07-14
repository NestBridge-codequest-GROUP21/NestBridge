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

export const videosApiMock: VideoResourceApi[] = [
  {
    id: 'video-arrival',
    videoKey: 'arrival-tips',
    title: 'Arriving in Ghana — What to Expect',
    description:
      'Orientation for international students and visitors landing at Kotoka International Airport.',
    category: 'Orientation',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    city: 'Accra',
  },
  {
    id: 'video-trotro',
    videoKey: 'trotro-safety',
    title: 'Using Trotros Safely in Accra',
    description: 'How shared minibuses work, fares, and safety tips for newcomers.',
    category: 'Transport',
    youtubeId: 'ScMzIvxBSi4',
    thumbnailUrl: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
    city: 'Accra',
  },
  {
    id: 'video-homestay',
    videoKey: 'homestay-etiquette',
    title: 'Homestay Etiquette in Ghana',
    description: 'Cultural expectations when living with a host family.',
    category: 'Culture',
    youtubeId: 'jNQXAC9IVRw',
    thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    city: 'Accra',
  },
  {
    id: 'video-accra',
    videoKey: 'accra-orientation',
    title: 'Accra Neighborhood Guide',
    description: 'East Legon, Osu, Labone, and getting oriented in the capital.',
    category: 'Orientation',
    youtubeId: 'M7lc1UVf-VE',
    thumbnailUrl: 'https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    city: 'Accra',
  },
];

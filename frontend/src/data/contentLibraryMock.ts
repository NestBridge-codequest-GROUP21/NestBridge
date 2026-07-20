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

function video(
  partial: Omit<VideoResourceApi, 'thumbnailUrl' | 'city'> & { city?: string },
): VideoResourceApi {
  return {
    city: 'Accra',
    thumbnailUrl: youtubeThumb(partial.youtubeId),
    ...partial,
  };
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

/**
 * Curated Ghana video library for students, tourists, exchange visitors,
 * volunteers, and expatriates. Every youtubeId is unique and playable —
 * no placeholders, memes, or repeated clips.
 */
export const videosApiMock: VideoResourceApi[] = [
  video({
    id: 'video-arrival',
    videoKey: 'arrival-tips',
    title: 'Arriving in Ghana — Visa, Money & Essentials',
    description:
      'Visa basics, SIM cards, Ghana cedis & ATMs, safety, plugs, and hotels — practical briefing for students, tourists, volunteers, and expats landing at Kotoka.',
    category: 'Orientation',
    youtubeId: 'ejJcat0HzQQ',
  }),
  video({
    id: 'video-evisa',
    videoKey: 'evisa-guide',
    title: 'Ghana eVisa Portal — How to Apply',
    description:
      'Walkthrough of Ghana’s official eVisa platform: eligibility checks, tourist and student options, and how to track your application online.',
    category: 'Visas',
    youtubeId: 'sPXAY_ADui4',
  }),
  video({
    id: 'video-accra-stay',
    videoKey: 'accra-orientation',
    title: 'Accra Neighborhood Guide',
    description:
      'Where to base yourself in Accra — areas near campus life (Legon), visitor hubs, and landmarks useful when choosing a homestay, hostel, or hotel.',
    category: 'Accommodation',
    youtubeId: '8JLOminF2Do',
  }),
  video({
    id: 'video-trotro',
    videoKey: 'trotro-safety',
    title: 'How to Take a Trotro in Ghana',
    description:
      'Beginner-friendly guide to Accra’s shared minibuses: spotting routes, paying the mate, signaling your stop, and riding confidently as a newcomer.',
    category: 'Transport',
    youtubeId: 'CiA_beyAAGg',
  }),
  video({
    id: 'video-accra-tour',
    videoKey: 'accra-getting-around',
    title: 'Getting Around Accra',
    description:
      'Neighborhood landmarks and how visitors move through the capital — Independence Square, Jamestown, and everyday Accra navigation.',
    category: 'Transport',
    youtubeId: '7-VI47c0Q4A',
  }),
  video({
    id: 'video-etiquette',
    videoKey: 'homestay-etiquette',
    title: 'Accra Culture, Food & Etiquette Tips',
    description:
      'First-trip culture notes, greetings, food moments, and respectful behavior for hosts, markets, and everyday Accra life.',
    category: 'Etiquette',
    youtubeId: 'Gjd_rKh5o64',
  }),
  video({
    id: 'video-market',
    videoKey: 'market-tips',
    title: 'Street Food & Markets in Accra',
    description:
      'Chop-bar lunch and West African food markets — practical for tourists, volunteers, and students exploring Accra with local hosts.',
    category: 'Food',
    youtubeId: 'YvlYjLPgrCE',
  }),
  video({
    id: 'video-food',
    videoKey: 'food-intro',
    title: 'Must-Try Ghanaian Food in Accra',
    description:
      'Jollof, banku, waakye, and other Accra favorites — a food primer for international students and short-stay visitors.',
    category: 'Food',
    youtubeId: 'Yk4cpG1BOHg',
  }),
  video({
    id: 'video-twi',
    videoKey: 'twi-basics',
    title: 'Learn Basic Twi in 10 Minutes',
    description:
      'Essential Twi phrases for greetings and everyday conversation — ideal for tourists, exchange students, and newcomers settling in.',
    category: 'Language',
    youtubeId: 'QI3cVpxmXmI',
  }),
  video({
    id: 'video-momo',
    videoKey: 'momo-app',
    title: 'MTN Mobile Money (MoMo) Tutorial',
    description:
      'How to use Ghana’s most common mobile wallet for transfers, payments, and everyday purchases once you have a local SIM.',
    category: 'Mobile Money',
    youtubeId: '5UWu7pNuUNE',
  }),
  video({
    id: 'video-safety',
    videoKey: 'ghana-safety',
    title: 'Is Ghana Safe? An Honest Traveler Take',
    description:
      'Practical safety context for Accra and beyond — what advisories mean, everyday precautions, and when to use NestBridge SOS / dial 112.',
    category: 'Safety',
    youtubeId: 'Ws3iD0aF9ok',
  }),
  video({
    id: 'video-cape-coast',
    videoKey: 'cape-coast-heritage',
    title: 'Cape Coast Castle — History & Visit',
    description:
      'Guided look at Cape Coast Castle and the Door of No Return — essential heritage context for diaspora travelers, students, and culture-focused trips.',
    category: 'Culture',
    youtubeId: 'icherdbJIWA',
  }),
  video({
    id: 'video-homowo',
    videoKey: 'homowo-festival',
    title: 'Ga Mashie Homowo Festival',
    description:
      'Scenes from Homowo in Accra — Ghana’s Ga harvest festival with kpokpoi, drumming, and community processions visitors may encounter in August.',
    category: 'Festivals',
    youtubeId: 'PBDPQtR741Y',
  }),
];

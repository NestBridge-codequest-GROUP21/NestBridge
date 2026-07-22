import type { TouristSiteDetail } from '../screens/tourist/TouristSiteDetailScreen';
import { normalizeCity } from './ghanaReference';

export interface TouristSiteSummary extends TouristSiteDetail {
  id: string;
  /** Keywords used to match local guides for this attraction. */
  guideKeywords: readonly string[];
  icon: string;
  accent?: 'gold';
}

export const touristSitesMock: TouristSiteSummary[] = [
  {
    id: 'site-cape-coast',
    name: 'Cape Coast Castle',
    city: 'Cape Coast',
    description:
      'A UNESCO World Heritage site and powerful window into the transatlantic slave trade. Guided tours explain the castle’s history and significance.',
    openingHours: 'Daily, 8:00 AM – 4:30 PM',
    admission: 'GHS 60 (includes guided tour)',
    guideKeywords: ['cape coast', 'castle', 'heritage', 'history', 'unesco'],
    icon: '🏰',
    accent: 'gold',
  },
  {
    id: 'site-kakum',
    name: 'Kakum National Park',
    city: 'Cape Coast',
    description:
      'Rainforest canopy walkway and guided nature trails. One of Ghana’s most popular eco-tourism destinations.',
    openingHours: 'Daily, 8:00 AM – 4:00 PM',
    admission: 'GHS 40 (canopy walk)',
    guideKeywords: ['kakum', 'canopy', 'nature', 'rainforest', 'cape coast'],
    icon: '🌳',
  },
  {
    id: 'site-labadi',
    name: 'Labadi Beach',
    city: 'Accra',
    description:
      'Popular city beach with local food stalls, live music on weekends, and easy access from Osu and Airport City.',
    openingHours: 'Daily, sunrise – sunset',
    admission: 'GHS 20 entry (weekends)',
    guideKeywords: ['labadi', 'beach', 'osu', 'accra', 'food'],
    icon: '🏖️',
  },
  {
    id: 'site-makola',
    name: 'Makola Market',
    city: 'Accra',
    description:
      'Accra’s bustling central market — fabrics, produce, and everyday goods. Best visited with a local guide for navigation tips.',
    openingHours: 'Mon–Sat, 7:00 AM – 6:00 PM',
    admission: 'Free entry',
    guideKeywords: ['makola', 'market', 'shopping', 'food', 'accra', 'city'],
    icon: '🛍️',
  },
  {
    id: 'site-nkrumah',
    name: 'Kwame Nkrumah Memorial Park',
    city: 'Accra',
    description:
      'A peaceful memorial and museum honoring Ghana’s first president, set in landscaped gardens near the coast.',
    openingHours: 'Tue–Sun, 9:00 AM – 5:00 PM',
    admission: 'GHS 20 (students GHS 10 with ID)',
    guideKeywords: ['nkrumah', 'memorial', 'history', 'accra', 'museum'],
    icon: '🏛️',
  },
  {
    id: 'site-manhyia',
    name: 'Manhyia Palace Museum',
    city: 'Kumasi',
    description:
      'Seat of the Asantehene with exhibits on Asante history, regalia, and culture in the heart of Kumasi.',
    openingHours: 'Tue–Sun, 9:00 AM – 5:00 PM',
    admission: 'GHS 40 (includes guided tour)',
    guideKeywords: ['manhyia', 'palace', 'asante', 'kumasi', 'cultural'],
    icon: '👑',
  },
  {
    id: 'site-kejetia',
    name: 'Kejetia Market',
    city: 'Kumasi',
    description:
      'One of West Africa’s largest open-air markets — fabrics, crafts, and everyday goods in central Kumasi.',
    openingHours: 'Mon–Sat, 7:00 AM – 6:00 PM',
    admission: 'Free entry',
    guideKeywords: ['kejetia', 'market', 'shopping', 'kumasi', 'city'],
    icon: '🛍️',
  },
  {
    id: 'site-mole',
    name: 'Mole National Park',
    city: 'Damongo',
    description:
      'Ghana’s largest wildlife park — guided savannah drives and walking safaris near Damongo.',
    openingHours: 'Daily, 6:00 AM – 5:00 PM',
    admission: 'Park fees apply (guided)',
    guideKeywords: ['mole', 'wildlife', 'safari', 'damongo', 'nature'],
    icon: '🐘',
  },
  {
    id: 'site-larabanga',
    name: 'Larabanga Mosque',
    city: 'Damongo',
    description:
      'One of West Africa’s oldest mosques, a short trip from Damongo — heritage architecture and local guides.',
    openingHours: 'Daylight hours',
    admission: 'Donation suggested',
    guideKeywords: ['larabanga', 'mosque', 'heritage', 'damongo'],
    icon: '🕌',
  },
  {
    id: 'site-tamale-central',
    name: 'Tamale Central Market',
    city: 'Tamale',
    description:
      'Northern Ghana’s busiest market — textiles, spices, and local food. Useful hub for Damongo travellers.',
    openingHours: 'Daily, morning – evening',
    admission: 'Free entry',
    guideKeywords: ['tamale', 'market', 'food', 'northern'],
    icon: '🛒',
  },
];

/** Legacy alias — old carousel used site-1 for Nkrumah park. */
const SITE_ID_ALIASES: Record<string, string> = {
  'site-1': 'site-nkrumah',
  'site-food': 'site-makola',
};

export function resolveTouristSiteId(siteId: string): string {
  return SITE_ID_ALIASES[siteId] ?? siteId;
}

export function touristSiteFromId(siteId: string): TouristSiteDetail | null {
  const resolved = resolveTouristSiteId(siteId);
  const site = touristSitesMock.find((entry) => entry.id === resolved);
  if (!site) {
    return null;
  }
  const {
    id: _id,
    guideKeywords: _keywords,
    icon: _icon,
    accent: _accent,
    ...detail
  } = site;
  return detail;
}

export function touristSiteSummaryFromId(
  siteId: string,
): TouristSiteSummary | null {
  const resolved = resolveTouristSiteId(siteId);
  return touristSitesMock.find((entry) => entry.id === resolved) ?? null;
}

/**
 * Map Explore carousel section IDs to tourist site keys.
 * Passes through known site IDs; never remaps Makola → Cape Coast.
 */
export function touristSiteIdFromCarouselSection(sectionId: string): string | null {
  if (sectionId === 'sites') {
    return null;
  }
  const resolved = resolveTouristSiteId(sectionId);
  if (touristSitesMock.some((site) => site.id === resolved)) {
    return resolved;
  }
  return null;
}

export function touristSitesForCity(city: string): TouristSiteSummary[] {
  if (!city.trim()) {
    return [...touristSitesMock];
  }
  const normalized = normalizeCity(city);
  const local = touristSitesMock.filter(
    (site) => normalizeCity(site.city) === normalized,
  );
  return local.length > 0 ? local : [...touristSitesMock];
}

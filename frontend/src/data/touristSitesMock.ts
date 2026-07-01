import type { TouristSiteDetail } from '../screens/tourist/TouristSiteDetailScreen';

export interface TouristSiteSummary extends TouristSiteDetail {
  id: string;
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
  },
  {
    id: 'site-kakum',
    name: 'Kakum National Park',
    city: 'Central Region',
    description:
      'Rainforest canopy walkway and guided nature trails. One of Ghana’s most popular eco-tourism destinations.',
    openingHours: 'Daily, 8:00 AM – 4:00 PM',
    admission: 'GHS 40 (canopy walk)',
  },
  {
    id: 'site-labadi',
    name: 'Labadi Beach',
    city: 'Accra',
    description:
      'Popular city beach with local food stalls, live music on weekends, and easy access from Osu and Airport City.',
    openingHours: 'Daily, sunrise – sunset',
    admission: 'GHS 20 entry (weekends)',
  },
  {
    id: 'site-makola',
    name: 'Makola Market',
    city: 'Accra',
    description:
      'Accra’s bustling central market — fabrics, produce, and everyday goods. Best visited with a local guide for navigation tips.',
    openingHours: 'Mon–Sat, 7:00 AM – 6:00 PM',
    admission: 'Free entry',
  },
  {
    id: 'site-1',
    name: 'Kwame Nkrumah Memorial Park',
    city: 'Accra',
    description:
      'A peaceful memorial and museum honoring Ghana’s first president, set in landscaped gardens near the coast.',
    openingHours: 'Tue–Sun, 9:00 AM – 5:00 PM',
    admission: 'GHS 20 (students GHS 10 with ID)',
  },
];

export function touristSiteFromId(siteId: string): TouristSiteDetail {
  const site = touristSitesMock.find((entry) => entry.id === siteId) ?? touristSitesMock[0];
  const { id: _id, ...detail } = site;
  return detail;
}

export function touristSiteIdFromCarouselSection(sectionId: string): string {
  if (sectionId === 'sites') return 'site-cape-coast';
  if (sectionId === 'site-food') return 'site-makola';
  if (touristSitesMock.some((s) => s.id === sectionId)) return sectionId;
  return 'site-cape-coast';
}

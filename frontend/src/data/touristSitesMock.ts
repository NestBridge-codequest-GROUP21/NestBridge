import type { TouristSiteDetail } from '../screens/tourist/TouristSiteDetailScreen';

export interface TouristSiteSummary extends TouristSiteDetail {
  id: string;
}

export const touristSitesMock: TouristSiteSummary[] = [
  {
    id: 'site-1',
    name: 'Kwame Nkrumah Memorial Park',
    city: 'Accra',
    description:
      'A peaceful memorial and museum honoring Ghana’s first president, set in landscaped gardens near the coast. A good first stop for orientation and history.',
    openingHours: 'Tue–Sun, 9:00 AM – 5:00 PM',
    admission: 'GHS 20 (students GHS 10 with ID)',
  },
  {
    id: 'site-2',
    name: 'Cape Coast Castle',
    city: 'Cape Coast',
    description:
      'A UNESCO World Heritage site and powerful window into the transatlantic slave trade. Guided tours explain the castle’s history and significance.',
    openingHours: 'Daily, 8:00 AM – 4:30 PM',
    admission: 'GHS 60 (includes guided tour)',
  },
];

export function touristSiteFromId(siteId: string): TouristSiteDetail {
  const site = touristSitesMock.find((entry) => entry.id === siteId) ?? touristSitesMock[0];
  const { id: _id, ...detail } = site;
  return detail;
}

import type { MatchResultHost } from '../screens/student/MatchResultsScreen';
import { normalizeCity } from './ghanaReference';

/** All seeded demo hosts — aligned with backend V2 host_profiles across Ghana cities. */
export const allSampleMatchResults: MatchResultHost[] = [
  {
    id: 'host-1',
    hostName: 'Abena Mensah',
    initials: 'AM',
    compatibilityScore: 96,
    trustBadge: 'VERIFIED',
    matchReasons: [
      'Halal meals offered',
      'Quiet evenings for study',
      'Speaks English and Twi',
      '10 min from University of Ghana',
    ],
    pricePerNight: 180,
    currency: 'GHS',
    location: 'East Legon, Accra',
  },
  {
    id: 'host-2',
    hostName: 'Kwame & Grace Asante',
    initials: 'KG',
    compatibilityScore: 91,
    trustBadge: 'TRUSTED',
    matchReasons: [
      'Social household — family dinners',
      'Vegetarian-friendly',
      'Near Cantonments and airport',
      'Verified host family since 2023',
    ],
    pricePerNight: 220,
    currency: 'GHS',
    location: 'Cantonments, Accra',
  },
  {
    id: 'host-3',
    hostName: 'Efua Boateng',
    initials: 'EB',
    compatibilityScore: 85,
    trustBadge: 'PRO',
    matchReasons: [
      'Early riser friendly',
      'Quiet household',
      'French and English spoken',
      'Osu — close to shops and campus shuttle',
    ],
    pricePerNight: 165,
    currency: 'GHS',
    location: 'Osu, Accra',
  },
  {
    id: 'host-5',
    hostName: 'Ama Serwaa Osei',
    initials: 'AS',
    compatibilityScore: 90,
    trustBadge: 'VERIFIED',
    matchReasons: [
      'Warm Ashanti hospitality',
      'Halal and vegetarian meals',
      'Central Adum location',
      'Near Kumasi cultural sites',
    ],
    pricePerNight: 150,
    currency: 'GHS',
    location: 'Adum, Kumasi',
  },
  {
    id: 'host-6',
    hostName: 'Kofi Mensah',
    initials: 'KM',
    compatibilityScore: 87,
    trustBadge: 'TRUSTED',
    matchReasons: [
      'Close to KNUST campus',
      'Study desk in room',
      'Vegetarian-friendly',
      'Quiet suburban household',
    ],
    pricePerNight: 130,
    currency: 'GHS',
    location: 'Ayeduase, Kumasi',
  },
  {
    id: 'host-9',
    hostName: 'Kwame Asante-Boateng',
    initials: 'KA',
    compatibilityScore: 84,
    trustBadge: 'VERIFIED',
    matchReasons: [
      'Breakfast included',
      'Quiet hours after 9pm',
      'Walking distance to Adum market',
      'English and Twi spoken',
    ],
    pricePerNight: 120,
    currency: 'GHS',
    location: 'Adum, Kumasi',
  },
  {
    id: 'host-11',
    hostName: 'Abena Mensah-Quaye',
    initials: 'AM',
    compatibilityScore: 82,
    trustBadge: 'TRUSTED',
    matchReasons: [
      'Eco-friendly vegan household',
      'Garden and bicycle rental',
      'Near Cape Coast University',
      'Coastal town experience',
    ],
    pricePerNight: 95,
    currency: 'GHS',
    location: 'Pedu, Cape Coast',
  },
  {
    id: 'host-12',
    hostName: 'Ibrahim Mahama',
    initials: 'IM',
    compatibilityScore: 80,
    trustBadge: 'VERIFIED',
    matchReasons: [
      'Halal meals included',
      'Prayer-friendly home',
      'Hausa and English spoken',
      'Northern Ghana hospitality',
    ],
    pricePerNight: 85,
    currency: 'GHS',
    location: 'Kalpohin, Tamale',
  },
];

/** Default Accra-only subset — kept for backwards-compatible imports. */
export const sampleMatchResults: MatchResultHost[] = filterMatchResultsByCity(
  'Accra',
  allSampleMatchResults,
);

export function filterMatchResultsByCity(
  city: string,
  results: MatchResultHost[] = allSampleMatchResults,
): MatchResultHost[] {
  const normalized = normalizeCity(city).toLowerCase();
  if (!normalized) return results;

  const filtered = results.filter((host) =>
    host.location.toLowerCase().includes(normalized),
  );
  return filtered;
}

export function sampleMatchResultsForCity(city: string): MatchResultHost[] {
  return filterMatchResultsByCity(city);
}

export function demoTopMatchHostIdForCity(city: string): string {
  const results = sampleMatchResultsForCity(city);
  return results[0]?.id ?? allSampleMatchResults[0]?.id ?? 'host-1';
}

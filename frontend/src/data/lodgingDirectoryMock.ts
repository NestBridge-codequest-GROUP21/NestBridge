import type { LodgingListing } from '../types/lodging';
import { normalizeCity } from './ghanaReference';

export const lodgingDirectoryMock: LodgingListing[] = [
  {
    id: 'lodging-1',
    name: 'Labadi Beach Hotel',
    category: 'HOTEL',
    city: 'Accra',
    area: 'Labadi',
    priceHint: 'From GHS 850/night',
    rating: 4.6,
    phone: '+233 30 277 1234',
    email: 'reservations@labadi-beach.example',
    bookingUrl: 'https://example.com/labadi-beach',
    description:
      'Beachfront resort with pool and restaurant. Popular with international visitors.',
    icon: '🏨',
  },
  {
    id: 'lodging-2',
    name: 'Movenpick Ambassador',
    category: 'HOTEL',
    city: 'Accra',
    area: 'Independence Avenue',
    priceHint: 'From GHS 720/night',
    rating: 4.5,
    phone: '+233 30 261 2345',
    email: 'info@movenpick-accra.example',
    bookingUrl: 'https://example.com/movenpick-accra',
    description:
      'Central business district location. Meeting rooms and airport shuttle available.',
    icon: '🏨',
  },
  {
    id: 'lodging-3',
    name: 'Osu Guest House',
    category: 'GUESTHOUSE',
    city: 'Accra',
    area: 'Osu',
    priceHint: 'From GHS 280/night',
    rating: 4.3,
    phone: '+233 24 555 7890',
    email: 'stay@osu-guesthouse.example',
    description:
      'Boutique guesthouse near Oxford Street. Quiet rooms and local breakfast.',
    icon: '🛏️',
  },
  {
    id: 'lodging-4',
    name: 'Golden Tulip Kumasi',
    category: 'PARTNER',
    city: 'Kumasi',
    area: 'Asokwa',
    priceHint: 'From GHS 450/night',
    rating: 4.4,
    phone: '+233 32 202 4567',
    bookingUrl: 'https://example.com/golden-tulip-kumasi',
    description:
      'Partner listing near Kejetia. Book directly on the hotel website.',
    icon: '🤝',
  },
  {
    id: 'lodging-5',
    name: 'Airport View Apartments',
    category: 'PARTNER',
    city: 'Accra',
    area: 'Airport Residential',
    priceHint: 'From GHS 350/night',
    rating: 4.2,
    phone: '+233 20 111 2233',
    email: 'bookings@airportview.example',
    bookingUrl: 'https://example.com/airport-view',
    description:
      'Self-catering apartments for short stays. Good for flexible check-in.',
    icon: '🏢',
  },
  {
    id: 'lodging-6',
    name: 'Kumasi City Inn',
    category: 'GUESTHOUSE',
    city: 'Kumasi',
    area: 'Adum',
    priceHint: 'From GHS 220/night',
    rating: 4.1,
    phone: '+233 24 888 9900',
    description: 'Budget-friendly rooms walking distance from cultural sites.',
    icon: '🛏️',
  },
];

export function lodgingListingsForCity(city: string): LodgingListing[] {
  const normalized = normalizeCity(city).toLowerCase();
  if (!normalized) return lodgingDirectoryMock;

  const filtered = lodgingDirectoryMock.filter(
    (listing) => listing.city.toLowerCase() === normalized,
  );
  return filtered;
}

export function lodgingCategoryLabel(category: LodgingListing['category']): string {
  switch (category) {
    case 'HOTEL':
      return 'Hotel';
    case 'GUESTHOUSE':
      return 'Guesthouse';
    case 'PARTNER':
      return 'Partner';
    default:
      return category;
  }
}

export function listingFromId(listingId: string): LodgingListing {
  return lodgingDirectoryMock.find((l) => l.id === listingId) ?? lodgingDirectoryMock[0];
}

export type ChecklistTask = {
  id: string;
  label: string;
  completed: boolean;
};

export type CulturalPhraseCard = {
  id: string;
  emoji: string;
  phrase: string;
  translation: string;
  hasAudio: boolean;
};

export type CulturalTopicCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type TransportRoute = {
  id: string;
  name: string;
  description: string;
  fareLabel: string;
  estimatedPrice: string;
};

export type TransportTab = {
  id: string;
  label: string;
  routes: TransportRoute[];
};

export type StayListing = {
  id: string;
  title: string;
  location: string;
  rating: number;
  pricePerNight: string;
  verifiedHost: boolean;
  amenities: string[];
  imageEmoji: string;
};

export type MapLandmark = {
  id: string;
  name: string;
  topPercent: number;
  leftPercent: number;
};

export type CalendarDayStatus = 'available' | 'booked' | 'blocked';

export type HostCalendarDay = {
  date: string;
  day: number;
  status: CalendarDayStatus;
};

export type ActiveBookingDetail = {
  guestName: string;
  dateRange: string;
  totalAmount: string;
};

export type HostListingItem = {
  id: string;
  address: string;
  imageEmoji: string;
  isOnline: boolean;
  bookingsScore: number;
};

export type TourTypeOption = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type GuideShiftBlock = 'morning' | 'afternoon' | 'evening';

export type GuideCalendarDay = {
  date: string;
  day: number;
  shifts: GuideShiftBlock[];
};

export const prepChecklistMock: ChecklistTask[] = [
  { id: 'admission', label: 'University Admission Letter', completed: true },
  { id: 'passport', label: 'Passport & Visa', completed: true },
  { id: 'yellow-fever', label: 'Yellow Fever Card', completed: true },
  { id: 'clothing', label: 'Pack light clothing for Ghana weather', completed: false },
  { id: 'sim', label: 'Secure a local SIM card', completed: false },
];

export const localTipsPhrasesMock: CulturalPhraseCard[] = [
  {
    id: 'akwaaba',
    emoji: '👋',
    phrase: 'Akwaaba',
    translation: 'Welcome',
    hasAudio: true,
  },
  {
    id: 'eti-sen',
    emoji: '😊',
    phrase: 'Eti sen?',
    translation: 'How are you?',
    hasAudio: true,
  },
];

export const localTipsTopicsMock: CulturalTopicCard[] = [
  {
    id: 'handshake',
    emoji: '🤝',
    title: 'Handshake norms',
    description: 'Right-hand greetings and respectful eye contact',
  },
  {
    id: 'phrases',
    emoji: '📣',
    title: 'Essential phrases',
    description: 'Common Twi greetings for daily interactions',
  },
];

export const transportTabsMock: TransportTab[] = [
  {
    id: 'trotros',
    label: 'Trotros',
    routes: [
      {
        id: 'campus-shuttle',
        name: 'Campus Shuttle',
        description: 'Trotros to Kumasi · Kanlow shuttle in Kumasi',
        fareLabel: '1 Fare',
        estimatedPrice: '$1.50',
      },
      {
        id: 'legon-accra',
        name: 'Legon → Accra Central',
        description: 'Direct trotro via Madina junction',
        fareLabel: '1 Fare',
        estimatedPrice: '$2.00',
      },
      {
        id: 'osu-circle',
        name: 'Osu → Circle',
        description: 'Shared minibus via Ring Road',
        fareLabel: '1 Fare',
        estimatedPrice: '$1.80',
      },
    ],
  },
  {
    id: 'shared-taxis',
    label: 'Shared Taxis',
    routes: [
      {
        id: 'airport-city',
        name: 'Airport → City Center',
        description: 'Shared taxi pool at arrivals',
        fareLabel: 'Per seat',
        estimatedPrice: '$8.00',
      },
      {
        id: 'tema-accra',
        name: 'Tema → Accra',
        description: 'Express shared taxi route',
        fareLabel: 'Per seat',
        estimatedPrice: '$5.50',
      },
    ],
  },
  {
    id: 'ride-hailing',
    label: 'Ride Hailing',
    routes: [
      {
        id: 'bolt-city',
        name: 'Bolt — City rides',
        description: 'On-demand rides across Greater Accra',
        fareLabel: 'Est. fare',
        estimatedPrice: '$4.50',
      },
      {
        id: 'yango-airport',
        name: 'Yango — Airport transfer',
        description: 'Fixed-rate airport pickup',
        fareLabel: 'Est. fare',
        estimatedPrice: '$12.00',
      },
    ],
  },
];

export const exploreStaysMock: StayListing[] = [
  {
    id: 'stay-1',
    title: 'Cozy Homestay — East Legon',
    location: 'East Legon, Accra',
    rating: 5,
    pricePerNight: '$12.90/night',
    verifiedHost: true,
    amenities: ['Wifi', 'AC'],
    imageEmoji: '🏡',
  },
  {
    id: 'stay-2',
    title: 'The Heritage Hotel',
    location: 'Cantonments, Accra',
    rating: 4,
    pricePerNight: '$3.99/night',
    verifiedHost: true,
    amenities: ['Wifi', 'Breakfast'],
    imageEmoji: '🏨',
  },
  {
    id: 'stay-3',
    title: 'Student Dorm Beds',
    location: 'University of Ghana, Legon',
    rating: 4,
    pricePerNight: '$7.52/night',
    verifiedHost: true,
    amenities: ['Wifi', 'Laundry'],
    imageEmoji: '🛏️',
  },
  {
    id: 'stay-4',
    title: 'Student Dorm Beds — Annex',
    location: 'Legon Campus North',
    rating: 4,
    pricePerNight: '$7.52/night',
    verifiedHost: true,
    amenities: ['Wifi', 'Study desk'],
    imageEmoji: '🛏️',
  },
];

export const offlineMapLandmarksMock: MapLandmark[] = [
  { id: 'cape-coast', name: 'Cape Coast Castle', topPercent: 62, leftPercent: 28 },
  { id: 'independence', name: 'Independence Arch', topPercent: 38, leftPercent: 52 },
  { id: 'labadi', name: 'Labadi Beach', topPercent: 45, leftPercent: 68 },
  { id: 'legon', name: 'University of Ghana', topPercent: 28, leftPercent: 42 },
];

export const hostCalendarDaysMock: HostCalendarDay[] = [
  { date: '2026-07-01', day: 1, status: 'available' },
  { date: '2026-07-02', day: 2, status: 'available' },
  { date: '2026-07-03', day: 3, status: 'available' },
  { date: '2026-07-04', day: 4, status: 'available' },
  { date: '2026-07-05', day: 5, status: 'available' },
  { date: '2026-07-06', day: 6, status: 'available' },
  { date: '2026-07-07', day: 7, status: 'available' },
  { date: '2026-07-08', day: 8, status: 'available' },
  { date: '2026-07-09', day: 9, status: 'available' },
  { date: '2026-07-10', day: 10, status: 'booked' },
  { date: '2026-07-11', day: 11, status: 'booked' },
  { date: '2026-07-12', day: 12, status: 'booked' },
  { date: '2026-07-13', day: 13, status: 'booked' },
  { date: '2026-07-14', day: 14, status: 'booked' },
  { date: '2026-07-15', day: 15, status: 'blocked' },
  { date: '2026-07-16', day: 16, status: 'blocked' },
  { date: '2026-07-17', day: 17, status: 'blocked' },
  { date: '2026-07-18', day: 18, status: 'blocked' },
  { date: '2026-07-19', day: 19, status: 'blocked' },
  { date: '2026-07-20', day: 20, status: 'available' },
  { date: '2026-07-21', day: 21, status: 'available' },
  { date: '2026-07-22', day: 22, status: 'available' },
  { date: '2026-07-23', day: 23, status: 'available' },
  { date: '2026-07-24', day: 24, status: 'available' },
  { date: '2026-07-25', day: 25, status: 'available' },
  { date: '2026-07-26', day: 26, status: 'available' },
  { date: '2026-07-27', day: 27, status: 'available' },
  { date: '2026-07-28', day: 28, status: 'available' },
  { date: '2026-07-29', day: 29, status: 'available' },
  { date: '2026-07-30', day: 30, status: 'available' },
  { date: '2026-07-31', day: 31, status: 'available' },
];

export const hostActiveBookingMock: ActiveBookingDetail = {
  guestName: 'John Doe',
  dateRange: 'July 10–14',
  totalAmount: '$250.00',
};

export const hostListingsMock: HostListingItem[] = [
  {
    id: 'listing-1',
    address: '12 Grade River, Accra',
    imageEmoji: '🏠',
    isOnline: true,
    bookingsScore: 100,
  },
  {
    id: 'listing-2',
    address: '45 Ring Road East, Accra',
    imageEmoji: '🏡',
    isOnline: true,
    bookingsScore: 100,
  },
  {
    id: 'listing-3',
    address: '8 Labadi Beach Road',
    imageEmoji: '🌴',
    isOnline: false,
    bookingsScore: 85,
  },
  {
    id: 'listing-4',
    address: '3 East Legon Close',
    imageEmoji: '🏘️',
    isOnline: true,
    bookingsScore: 100,
  },
];

export const tourTypesMock: TourTypeOption[] = [
  {
    id: 'history',
    label: 'History & Heritage Walk',
    description: 'Castles, museums, and cultural landmarks',
    enabled: true,
  },
  {
    id: 'food',
    label: 'Local Food & Market Experience',
    description: 'Markets, street food, and cooking demos',
    enabled: true,
  },
  {
    id: 'nightlife',
    label: 'Nightlife & Arts Experience',
    description: 'Live music, galleries, and evening culture',
    enabled: false,
  },
];

export const guideCalendarDaysMock: GuideCalendarDay[] = [
  { date: '2026-07-01', day: 1, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-02', day: 2, shifts: ['morning'] },
  { date: '2026-07-03', day: 3, shifts: ['afternoon', 'evening'] },
  { date: '2026-07-04', day: 4, shifts: ['morning', 'afternoon', 'evening'] },
  { date: '2026-07-05', day: 5, shifts: [] },
  { date: '2026-07-06', day: 6, shifts: ['morning'] },
  { date: '2026-07-07', day: 7, shifts: ['evening'] },
  { date: '2026-07-08', day: 8, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-09', day: 9, shifts: ['afternoon'] },
  { date: '2026-07-10', day: 10, shifts: ['morning', 'evening'] },
  { date: '2026-07-11', day: 11, shifts: ['morning', 'afternoon', 'evening'] },
  { date: '2026-07-12', day: 12, shifts: ['morning'] },
  { date: '2026-07-13', day: 13, shifts: ['afternoon', 'evening'] },
  { date: '2026-07-14', day: 14, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-15', day: 15, shifts: [] },
  { date: '2026-07-16', day: 16, shifts: ['evening'] },
  { date: '2026-07-17', day: 17, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-18', day: 18, shifts: ['morning'] },
  { date: '2026-07-19', day: 19, shifts: ['afternoon'] },
  { date: '2026-07-20', day: 20, shifts: ['morning', 'evening'] },
  { date: '2026-07-21', day: 21, shifts: ['morning', 'afternoon', 'evening'] },
  { date: '2026-07-22', day: 22, shifts: ['afternoon'] },
  { date: '2026-07-23', day: 23, shifts: ['morning'] },
  { date: '2026-07-24', day: 24, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-25', day: 25, shifts: ['evening'] },
  { date: '2026-07-26', day: 26, shifts: ['morning', 'afternoon', 'evening'] },
  { date: '2026-07-27', day: 27, shifts: [] },
  { date: '2026-07-28', day: 28, shifts: ['morning'] },
  { date: '2026-07-29', day: 29, shifts: ['afternoon', 'evening'] },
  { date: '2026-07-30', day: 30, shifts: ['morning', 'afternoon'] },
  { date: '2026-07-31', day: 31, shifts: ['evening'] },
];

export const GUIDE_SHIFT_LABELS: Record<GuideShiftBlock, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

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
  /** True only when host identity/provider verification is confirmed. */
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
    translation: 'Welcome — say this when you arrive at a home or shop',
    hasAudio: false,
  },
  {
    id: 'eti-sen',
    emoji: '😊',
    phrase: 'Ɛte sɛn?',
    translation: 'How are you? (Twi) — a friendly everyday greeting',
    hasAudio: false,
  },
  {
    id: 'medaase',
    emoji: '🙏',
    phrase: 'Medaase',
    translation: 'Thank you — use liberally with hosts, drivers, and vendors',
    hasAudio: false,
  },
  {
    id: 'mepa-kyew',
    emoji: '✋',
    phrase: 'Mepa wo kyɛw',
    translation: 'Please / excuse me — useful in trotros and markets',
    hasAudio: false,
  },
  {
    id: 'me-din-de',
    emoji: '🗣️',
    phrase: 'Me din de…',
    translation: 'My name is… — introduce yourself to your host family',
    hasAudio: false,
  },
  {
    id: 'eye',
    emoji: '👍',
    phrase: 'Ɛyɛ',
    translation: 'It’s fine / okay — casual agreement you’ll hear often',
    hasAudio: false,
  },
];

export const localTipsTopicsMock: CulturalTopicCard[] = [
  {
    id: 'handshake',
    emoji: '🤝',
    title: 'Greet before you ask',
    description:
      'Always greet before business. Use your right hand for handshakes, money, and food. Greet elders first.',
  },
  {
    id: 'trotro',
    emoji: '🚌',
    title: 'Trotro & “mate” talk',
    description:
      'The mate collects fares and calls stops. Say your stop early, keep small notes ready, and ask locals which park serves your route.',
  },
  {
    id: 'mobile-money',
    emoji: '📱',
    title: 'Mobile money basics',
    description:
      'MTN MoMo and Vodafone Cash are everyday payment tools. Register with your passport and keep your PIN private.',
  },
  {
    id: 'meals',
    emoji: '🍽️',
    title: 'Sharing meals at home',
    description:
      'Wait to be invited to eat. Washing hands before a shared meal is common. Trying the food is a warm way to show respect.',
  },
  {
    id: 'dress',
    emoji: '👕',
    title: 'Dress for the setting',
    description:
      'Accra is casual, but cover shoulders and knees for churches, mosques, and formal family visits. Light fabrics help in the heat.',
  },
  {
    id: 'safety',
    emoji: '🛡️',
    title: 'Street-smart habits',
    description:
      'Use Bolt or Yango at night, agree fares before unmarked taxis, and keep phones pocketed in crowded markets like Makola.',
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
        description: 'Legon campus shuttle loop',
        fareLabel: '1 Fare',
        estimatedPrice: 'GHS 5',
      },
      {
        id: 'legon-accra',
        name: 'Legon → Accra Central',
        description: 'Direct trotro via Madina junction',
        fareLabel: '1 Fare',
        estimatedPrice: 'GHS 8',
      },
      {
        id: 'osu-circle',
        name: 'Osu → Circle',
        description: 'Shared minibus via Ring Road',
        fareLabel: '1 Fare',
        estimatedPrice: 'GHS 6',
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
        estimatedPrice: 'GHS 30',
      },
      {
        id: 'tema-accra',
        name: 'Tema → Accra',
        description: 'Express shared taxi route',
        fareLabel: 'Per seat',
        estimatedPrice: 'GHS 25',
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
        estimatedPrice: 'GHS 35',
      },
      {
        id: 'yango-airport',
        name: 'Yango — Airport transfer',
        description: 'Fixed-rate airport pickup',
        fareLabel: 'Est. fare',
        estimatedPrice: 'GHS 90',
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
    pricePerNight: 'GHS 180/night',
    verifiedHost: true,
    amenities: ['Wifi', 'AC'],
    imageEmoji: '🏡',
  },
  {
    id: 'stay-2',
    title: 'The Heritage Hotel',
    location: 'Cantonments, Accra',
    rating: 4,
    pricePerNight: 'GHS 350/night',
    verifiedHost: false,
    amenities: ['Wifi', 'Breakfast'],
    imageEmoji: '🏨',
  },
  {
    id: 'stay-3',
    title: 'Student Dorm Beds',
    location: 'University of Ghana, Legon',
    rating: 4,
    pricePerNight: 'GHS 90/night',
    verifiedHost: false,
    amenities: ['Wifi', 'Laundry'],
    imageEmoji: '🛏️',
  },
  {
    id: 'stay-4',
    title: 'Student Dorm Beds — Annex',
    location: 'Legon Campus North',
    rating: 4,
    pricePerNight: 'GHS 90/night',
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
  guestName: 'Akosua Darko',
  dateRange: 'Sep 1 – Dec 15',
  totalAmount: 'GHS 18,900',
};

export const hostListingsMock: HostListingItem[] = [
  {
    id: 'listing-1',
    address: '12 East Legon, Accra',
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

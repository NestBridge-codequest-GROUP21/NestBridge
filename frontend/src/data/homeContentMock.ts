import type { FeaturedHomeCardProps } from '../components/FeaturedHomeCard';
import type { RecentActivityItem } from '../components/RecentActivityList';
import type { HomeStatItem } from '../components/HomeStatsCarousel';
import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';
import { normalizeCity } from './ghanaReference';

export const studentFeaturedMatchMock: Omit<
  FeaturedHomeCardProps,
  'onPress'
> = {
  sectionLabel: 'Your top match',
  name: 'Abena Mensah',
  badge: '96% match',
  details: 'East Legon, Accra · GHS 180/night',
  matchReasons: ['Speaks Twi & English', 'Halal & vegetarian meals'],
  ctaLabel: 'View profile →',
  initials: 'AM',
};

export const studentFeaturedMatchKumasiMock: Omit<
  FeaturedHomeCardProps,
  'onPress'
> = {
  sectionLabel: 'Your top match',
  name: 'Ama Serwaa Osei',
  badge: '90% match',
  details: 'Adum, Kumasi · GHS 150/night',
  matchReasons: ['Warm Ashanti hospitality', 'Halal & vegetarian meals'],
  ctaLabel: 'View profile →',
  initials: 'AS',
};

export function studentFeaturedMatchForCity(
  city: string,
): Omit<FeaturedHomeCardProps, 'onPress'> {
  const normalized = normalizeCity(city).toLowerCase();
  if (normalized === 'kumasi') {
    return studentFeaturedMatchKumasiMock;
  }
  return studentFeaturedMatchMock;
}

export const studentStatusMock = {
  icon: '✈️',
  label: 'Heading to Accra in 12 days',
};

export const studentReminderMock =
  'Complete your pre-arrival checklist before you arrive.';

export const studentRecentActivityMock: RecentActivityItem[] = [
  {
    id: 'act-1',
    icon: '✅',
    title: 'Host accepted your request',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-2',
    icon: '💬',
    title: 'Guide replied to your message',
    timestamp: 'Yesterday',
  },
  {
    id: 'act-3',
    icon: '🛬',
    title: 'Airport pickup confirmed',
    timestamp: '3 days ago',
  },
];

/** Prep shortcuts — excludes Transport (already in student quick actions). */
export const studentRecommendedMock: ExploreSectionItem[] = [
  {
    id: 'greetings',
    title: 'Culture & language',
    subtitle: 'Twi phrases and etiquette for newcomers',
    icon: '👋',
  },
  {
    id: 'packing',
    title: 'Things to pack',
    subtitle: 'Essentials for Ghana weather',
    icon: '🎒',
  },
  {
    id: 'events',
    title: 'Student events',
    subtitle: 'Campus meetups this month',
    icon: '🎓',
  },
];

/** Must match suggestedGuidesMock[0] (guide-1) — same ID the home CTA opens. */
export const touristFeaturedGuideMock: Omit<FeaturedHomeCardProps, 'onPress'> = {
  sectionLabel: 'Recommended for you',
  name: 'Kofi Asante — City Tour',
  badge: 'Top rated guide',
  details: 'English & Twi · Accra (Osu & Labadi) · Available this week',
  ctaLabel: 'See all guides →',
  initials: 'KA',
};

export const touristStatusMock = {
  icon: '📍',
  label: 'Exploring Accra',
};

export const touristReminderMock =
  'Emergency contacts are always available from the SOS button.';

export const touristRecentActivityMock: RecentActivityItem[] = [
  {
    id: 't-act-1',
    icon: '✅',
    title: 'Guide accepted your booking',
    timestamp: '1 hour ago',
  },
  {
    id: 't-act-2',
    icon: '🗓️',
    title: "Today's itinerary: City orientation",
    timestamp: 'Today',
  },
  {
    id: 't-act-3',
    icon: '📍',
    title: 'Next destination: Kakum Park',
    timestamp: 'Tomorrow',
  },
];

export const hostFeaturedRequestMock: Omit<FeaturedHomeCardProps, 'onPress'> = {
  sectionLabel: 'Incoming request',
  name: 'James Osei',
  badge: '88% match',
  details: 'Requesting Sep 10–Nov 20 · Close to campus',
  ctaLabel: 'Review request →',
  initials: 'JO',
};

export const hostStatusMock = {
  icon: '🏠',
  label: '2 active bookings',
};

export const hostPerformanceMock: HomeStatItem[] = [
  { id: 'views', value: '128', label: 'Views', subtitle: 'This month' },
  { id: 'occupancy', value: '78%', label: 'Occupancy', subtitle: 'Last 30 days' },
  { id: 'rating', value: '4.8★', label: 'Rating', subtitle: '12 reviews' },
];

export const hostReminderMock =
  'Complete your safeguarding module to accept minor guests.';

export const hostRecentActivityMock: RecentActivityItem[] = [
  {
    id: 'h-act-1',
    icon: '⭐',
    title: 'New review from James',
    timestamp: '4 hours ago',
  },
  {
    id: 'h-act-2',
    icon: '✅',
    title: 'Booking confirmed for Aug 10',
    timestamp: 'Yesterday',
  },
  {
    id: 'h-act-3',
    icon: '💰',
    title: 'Payment received — GHS 1,800',
    timestamp: '2 days ago',
  },
];

export const guideFeaturedTourMock: Omit<FeaturedHomeCardProps, 'onPress'> = {
  sectionLabel: 'Upcoming tour',
  name: 'James K. — City Tour',
  badge: 'Today 2:00 PM',
  details: '4 guests · Labadi Beach pickup',
  ctaLabel: 'View details →',
  initials: 'JK',
};

export const guideStatusMock = {
  icon: '🗺️',
  label: '3 upcoming tours',
};

export const guideTourSuggestionsMock: ExploreSectionItem[] = [
  {
    id: 'city-tour',
    title: 'City tour',
    subtitle: 'Orientation walks in Accra',
    icon: '🏙️',
  },
  {
    id: 'food-tour',
    title: 'Food tour',
    subtitle: 'Local dishes and markets',
    icon: '🍲',
  },
  {
    id: 'museum-tour',
    title: 'Museum tour',
    subtitle: 'Heritage and history',
    icon: '🏛️',
  },
  {
    id: 'weekend-tour',
    title: 'Weekend tour',
    subtitle: 'Day trips outside the city',
    icon: '🌴',
  },
];

export const guideReminderMock = 'Update your availability for next week.';

export const guideRecentActivityMock: RecentActivityItem[] = [
  {
    id: 'g-act-1',
    icon: '📩',
    title: 'New booking received',
    timestamp: '30 min ago',
  },
  {
    id: 'g-act-2',
    icon: '💰',
    title: 'Payment received — GHS 320',
    timestamp: 'Yesterday',
  },
  {
    id: 'g-act-3',
    icon: '⭐',
    title: 'Review posted by James',
    timestamp: '3 days ago',
  },
];

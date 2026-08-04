import type { HomeRole } from './homeNavigation';

export interface ProfileHubItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

/**
 * Homestays are reached via Explore’s stay shortcut (“Browse homestays” /
 * “Find stays & lodging”), not duplicated in the guidance list below.
 */

const STUDENT_CULTURAL_ITEMS: ProfileHubItem[] = [
  {
    id: 'universities',
    label: 'Nearby universities',
    description: 'Campuses and institutions near your destination',
    icon: '🎓',
  },
  {
    id: 'video-library',
    label: 'Video library',
    description: 'Orientation, transport, and culture videos',
    icon: '🎬',
  },
  {
    id: 'checklist',
    label: 'Prep checklist',
    description: 'Documents, packing, and arrival tasks',
    icon: '✅',
  },
  {
    id: 'nearby-community',
    label: 'People nearby',
    description: 'Students and host families in your city',
    icon: '👥',
  },
  {
    id: 'student-events',
    label: 'Student events',
    description: 'Meetups, orientation, and campus gatherings',
    icon: '📅',
  },
  {
    id: 'cultural-tips',
    label: 'Culture & language',
    description: 'Greetings, Twi phrases, etiquette, and customs',
    icon: '👋',
  },
  {
    id: 'practical-tips',
    label: 'Local tips',
    description: 'Transport, money, SIM cards, safety, and daily living',
    icon: '📍',
  },
  {
    id: 'sponsors',
    label: 'Sponsors',
    description: 'Scholarships and travel support partners',
    icon: '🏆',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Tro-tro, ride apps, and getting around safely',
    icon: '🚌',
  },
];

/** Tourist Explore hub — visit Ghana (no student events / sponsors / prep). */
const TOURIST_CULTURAL_ITEMS: ProfileHubItem[] = [
  {
    id: 'video-library',
    label: 'Video library',
    description: 'Ghana travel tips and cultural guides',
    icon: '🎬',
  },
  {
    id: 'sites-directory',
    label: 'Sites & culture',
    description: 'Heritage sites, markets, and landmarks',
    icon: '🏛️',
  },
  {
    id: 'offline-map',
    label: 'Offline map',
    description: 'Download maps before you lose signal',
    icon: '📍',
  },
  {
    id: 'cultural-tips',
    label: 'Culture & language',
    description: 'Phrases, greetings, and cultural etiquette',
    icon: '👋',
  },
  {
    id: 'practical-tips',
    label: 'Local tips',
    description: 'Money, SIM cards, safety, and getting around',
    icon: '📍',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Navigate the city with confidence',
    icon: '🚌',
  },
];

/**
 * Host / guide Explore — local ops + travel booking entry points.
 * No newcomer “local tips” / culture primers (hosts and guides are locals).
 */
const HOST_EXPLORE_ITEMS: ProfileHubItem[] = [
  {
    id: 'listings',
    label: 'Your listings',
    description: 'Photos, house rules, and stay details guests see',
    icon: '🏠',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Block dates and review upcoming guest stays',
    icon: '📅',
  },
  {
    id: 'video-library',
    label: 'Hosting videos',
    description: 'Tips for welcoming international guests',
    icon: '🎬',
  },
  {
    id: 'offline-map',
    label: 'Offline map',
    description: 'Help guests navigate your neighbourhood',
    icon: '📍',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Share safe ways for guests to get around',
    icon: '🚌',
  },
];

const GUIDE_EXPLORE_ITEMS: ProfileHubItem[] = [
  {
    id: 'tour-types',
    label: 'Tour types',
    description: 'City, food, heritage, and custom experiences',
    icon: '🎯',
  },
  {
    id: 'availability',
    label: 'Availability',
    description: 'Open session slots travellers can book',
    icon: '📅',
  },
  {
    id: 'sites-directory',
    label: 'Sites & attractions',
    description: 'Landmarks to weave into your tours',
    icon: '🏛️',
  },
  {
    id: 'video-library',
    label: 'Guide videos',
    description: 'Storytelling and visitor experience tips',
    icon: '🎬',
  },
  {
    id: 'offline-map',
    label: 'Offline map',
    description: 'Navigate with guests when signal drops',
    icon: '📍',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Pickup points and local transfers',
    icon: '🚌',
  },
];

export function culturalGuidanceItemsForRole(role: HomeRole): ProfileHubItem[] {
  switch (role) {
    case 'TOURIST':
    case 'BROWSE':
      return TOURIST_CULTURAL_ITEMS;
    case 'STUDENT':
      return STUDENT_CULTURAL_ITEMS;
    case 'HOST':
      return HOST_EXPLORE_ITEMS;
    case 'GUIDE':
      return GUIDE_EXPLORE_ITEMS;
    default:
      return STUDENT_CULTURAL_ITEMS;
  }
}

export function shouldShowTravelBookingEntry(_role: HomeRole): boolean {
  // Hosts/guides use ExploreHub primary “Browse stays & guides”.
  // Do not duplicate that entry on Profile as “Book as a traveller”.
  return false;
}

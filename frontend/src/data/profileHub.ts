import type { HomeRole } from './homeNavigation';

export interface ProfileHubItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const STUDENT_CULTURAL_ITEMS: ProfileHubItem[] = [
  {
    id: 'checklist',
    label: 'Prep checklist',
    description: 'Documents, packing, and arrival tasks',
    icon: '✅',
  },
  {
    id: 'cultural-tips',
    label: 'Local tips',
    description: 'Greetings, customs, and everyday etiquette',
    icon: '👋',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Tro-tro, ride apps, and getting around safely',
    icon: '🚌',
  },
];

const TOURIST_CULTURAL_ITEMS: ProfileHubItem[] = [
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
    label: 'Local tips',
    description: 'Phrases and cultural pointers for visitors',
    icon: '👋',
  },
  {
    id: 'transport',
    label: 'Transport guide',
    description: 'Navigate the city with confidence',
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
    case 'GUIDE':
      return [
        ...STUDENT_CULTURAL_ITEMS,
        {
          id: 'offline-map',
          label: 'Offline map',
          description: 'Useful when hosting or touring off-grid',
          icon: '📍',
        },
      ];
    default:
      return STUDENT_CULTURAL_ITEMS;
  }
}

export function shouldShowTravelBookingEntry(role: HomeRole): boolean {
  return role === 'HOST' || role === 'GUIDE';
}

import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';

export const exploreSectionsMock: ExploreSectionItem[] = [
  {
    id: 'guides',
    title: 'Book a guide',
    subtitle: 'Tours, orientation, and local experiences',
    icon: '🗺️',
  },
  {
    id: 'homestays',
    title: 'NestBridge homestays',
    subtitle: 'Stay with a verified host family',
    icon: '🏡',
  },
  {
    id: 'lodging',
    title: 'Find lodging',
    subtitle: 'Hotels and partners — book outside the app',
    icon: '🏨',
  },
  {
    id: 'sites',
    title: 'Tourist sites',
    subtitle: 'Landmarks, museums, and must-see places',
    icon: '📍',
    accent: 'gold',
  },
];

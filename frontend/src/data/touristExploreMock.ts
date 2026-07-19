import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';

/** Tourist home carousel — local sites (guides/stays use dedicated search flows). */
export const exploreSectionsMock: ExploreSectionItem[] = [
  {
    id: 'site-cape-coast',
    title: 'Cape Coast Castle',
    subtitle: 'UNESCO heritage site on the coast',
    icon: '🏰',
    accent: 'gold',
  },
  {
    id: 'site-kakum',
    title: 'Kakum National Park',
    subtitle: 'Canopy walk and rainforest trails',
    icon: '🌳',
  },
  {
    id: 'site-labadi',
    title: 'Labadi Beach',
    subtitle: 'Sun, sand, and local food stalls',
    icon: '🏖️',
  },
  {
    id: 'site-makola',
    title: 'Makola Market',
    subtitle: 'Fabrics, produce, and local shopping',
    icon: '🛍️',
  },
];

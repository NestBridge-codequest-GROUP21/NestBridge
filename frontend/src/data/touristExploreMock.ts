import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';

/** Tourist home carousel — local sites only (guides/stays live in Search tab). */
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
    id: 'site-food',
    title: 'Local food tour',
    subtitle: 'Jollof, kelewele, and market bites',
    icon: '🍲',
    accent: 'gold',
  },
];

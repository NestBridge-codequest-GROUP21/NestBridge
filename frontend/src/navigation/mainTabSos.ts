import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

/** Actor home dashboards — the only screens that show the raised SOS tab-bar button. */
export const HOME_SOS_ROUTES = new Set<keyof AppStackParamList>([
  'StudentHome',
  'ExploreHome',
  'HostHome',
  'GuideHome',
]);

export function homeTabSosProps(
  navigation: NativeStackNavigationProp<AppStackParamList>,
) {
  return {
    showSosDock: true as const,
    onSosPress: () => navigation.navigate('SOS'),
  };
}

export function handleProfileCulturalItem(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  itemId: string,
) {
  if (itemId === 'video-library') {
    navigation.navigate('VideoLibrary');
    return;
  }
  if (itemId === 'checklist') {
    navigation.navigate('PrepChecklist');
    return;
  }
  if (itemId === 'cultural-tips') {
    navigation.navigate('LocalTips');
    return;
  }
  if (itemId === 'transport') {
    navigation.navigate('TransportGuide');
    return;
  }
  if (itemId === 'offline-map') {
    navigation.navigate('OfflineMap');
    return;
  }
  if (itemId === 'sponsors') {
    navigation.navigate('SponsorList');
    return;
  }
  if (itemId === 'sites-directory') {
    navigation.navigate('SitesDirectory');
  }
}

const GUIDE_TOUR_ICONS: Record<string, string> = {
  history: '🏛️',
  food: '🍲',
  nightlife: '🎭',
};

export function guideTourSectionsFromTypes(
  tourTypes: Array<{ id: string; label: string; description: string; enabled: boolean }>,
) {
  return tourTypes
    .filter((tour) => tour.enabled)
    .map((tour) => ({
      id: tour.id,
      title: tour.label,
      subtitle: tour.description,
      icon: GUIDE_TOUR_ICONS[tour.id] ?? '🗺️',
    }));
}

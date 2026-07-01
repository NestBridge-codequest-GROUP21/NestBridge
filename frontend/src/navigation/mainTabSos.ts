import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

export function mainTabSosProps(
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

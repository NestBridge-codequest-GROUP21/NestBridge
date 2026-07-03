import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

/** Screens that already expose SOS via the tab bar or an in-screen control. */
export const STACK_SOS_EXCLUDED = new Set<keyof AppStackParamList>([
  'SOS',
  'BrowseHome',
  'StudentHome',
  'ExploreHome',
  'HostHome',
  'GuideHome',
  'Profile',
  'MessagesTab',
  'HostRequestsTab',
  'HostBookingsTab',
  'HostEarningsTab',
  'GuideBookingsTab',
  'GuideEarningsTab',
  'UnifiedSearch',
  'StudentBookings',
  'MatchSearch',
  'KYCPrompt',
  'SponsorList',
  'SponsorDetail',
  'SponsorApplication',
]);

export function shouldWrapStackSos(routeName: keyof AppStackParamList): boolean {
  return !STACK_SOS_EXCLUDED.has(routeName);
}

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

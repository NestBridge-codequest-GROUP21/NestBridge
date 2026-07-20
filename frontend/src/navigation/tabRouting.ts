import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeRole } from '../data/homeNavigation';
import type { HomeRoute } from '../utils/accountProfile';
import type { AppStackParamList } from './types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

function resetToTab<K extends keyof AppStackParamList>(
  navigation: Nav,
  screen: K,
  params?: AppStackParamList[K],
) {
  navigation.reset({
    index: 0,
    routes: [params !== undefined ? { name: screen, params } : { name: screen }],
  });
}

function homeRouteToScreenName(
  route: HomeRoute,
): 'IntentSelect' | 'BrowseHome' | 'StudentHome' | 'ExploreHome' | 'HostHome' | 'GuideHome' {
  switch (route) {
    case 'StudentHome':
      return 'StudentHome';
    case 'ExploreHome':
      return 'ExploreHome';
    case 'HostHome':
      return 'HostHome';
    case 'GuideHome':
      return 'GuideHome';
    case 'IntentSelect':
      return 'IntentSelect';
    default:
      return 'BrowseHome';
  }
}

export function navigateToHome(navigation: Nav, route: HomeRoute) {
  navigation.reset({
    index: 0,
    routes: [{ name: homeRouteToScreenName(route) }],
  });
}

export function handleTabPress(
  navigation: Nav,
  tabId: string,
  role: HomeRole,
  contextHomeRoute: HomeRoute,
) {
  if (tabId === 'home') {
    navigateToHome(navigation, contextHomeRoute);
    return;
  }

  if (tabId === 'explore' || tabId === 'search') {
    resetToTab(navigation, 'ExploreHub');
    return;
  }

  if (tabId === 'bookings') {
    if (role === 'HOST') {
      resetToTab(navigation, 'HostBookingsTab');
      return;
    }
    if (role === 'GUIDE') {
      resetToTab(navigation, 'GuideBookingsTab');
      return;
    }
    resetToTab(navigation, 'StudentBookings');
    return;
  }

  if (tabId === 'requests') {
    resetToTab(navigation, 'HostRequestsTab');
    return;
  }

  if (tabId === 'earnings') {
    resetToTab(navigation, 'GuideEarningsTab');
    return;
  }

  if (tabId === 'messages') {
    resetToTab(navigation, 'MessagesTab');
    return;
  }

  if (tabId === 'profile') {
    resetToTab(navigation, 'Profile');
  }
}

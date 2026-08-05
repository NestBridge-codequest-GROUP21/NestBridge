import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeRole } from '../data/homeNavigation';
import type { HomeRoute } from '../utils/accountProfile';
import type { AppStackParamList } from './types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

/** Tab switches should navigate (fast), not reset (full remount / lag). */
function goToTab<K extends keyof AppStackParamList>(
  navigation: Nav,
  screen: K,
  params?: AppStackParamList[K],
) {
  if (params !== undefined) {
    navigation.navigate(screen, params);
    return;
  }
  navigation.navigate(screen);
}

function homeRouteToScreenName(
  route: HomeRoute,
):
  | 'IntentSelect'
  | 'BrowseHome'
  | 'StudentHome'
  | 'ExploreHome'
  | 'HostHome'
  | 'GuideHome'
  | 'AdminHome' {
  switch (route) {
    case 'StudentHome':
      return 'StudentHome';
    case 'ExploreHome':
      return 'ExploreHome';
    case 'HostHome':
      return 'HostHome';
    case 'GuideHome':
      return 'GuideHome';
    case 'AdminHome':
      return 'AdminHome';
    case 'IntentSelect':
      return 'IntentSelect';
    default:
      return 'BrowseHome';
  }
}

export function navigateToHome(navigation: Nav, route: HomeRoute) {
  goToTab(navigation, homeRouteToScreenName(route));
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

  if (role === 'STAFF') {
    if (tabId === 'users') {
      goToTab(navigation, 'StaffUserSearch');
      return;
    }
    if (tabId === 'moderation') {
      goToTab(navigation, 'AdminModeration');
      return;
    }
    if (tabId === 'preview') {
      goToTab(navigation, 'AdminPreview');
      return;
    }
    if (tabId === 'profile') {
      goToTab(navigation, 'Profile');
      return;
    }
  }

  if (tabId === 'explore' || tabId === 'search') {
    goToTab(navigation, 'ExploreHub');
    return;
  }

  if (tabId === 'bookings') {
    if (role === 'HOST') {
      goToTab(navigation, 'HostBookingsTab');
      return;
    }
    if (role === 'GUIDE') {
      goToTab(navigation, 'GuideBookingsTab');
      return;
    }
    goToTab(navigation, 'StudentBookings');
    return;
  }

  if (tabId === 'requests') {
    goToTab(navigation, 'HostRequestsTab');
    return;
  }

  if (tabId === 'earnings') {
    goToTab(navigation, 'GuideEarningsTab');
    return;
  }

  if (tabId === 'messages') {
    goToTab(navigation, 'MessagesTab');
    return;
  }

  if (tabId === 'profile') {
    goToTab(navigation, 'Profile');
  }
}

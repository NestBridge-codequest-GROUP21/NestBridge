import type { TabBarItem } from '../components/AppTabBar';
import type { QuickActionItem } from '../components/QuickActionsGrid';
import type { PrimaryIntent } from '../types/accountProfile';

export type HomeRole = PrimaryIntent | 'BROWSE';

export const SEEKER_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'search', label: 'Search', icon: 'search-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
];

export const HOST_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'requests', label: 'Requests', icon: 'documents-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
];

export const GUIDE_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'earnings', label: 'Earnings', icon: 'cash-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
];

export const STUDENT_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'cultural-tips', label: 'Local tips', icon: '👋' },
  { id: 'transport', label: 'Transport', icon: '🚌' },
  { id: 'sos', label: 'SOS', icon: '🆘' },
];

export const TOURIST_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'book-guide', label: 'Book guide', icon: '🗺️' },
  { id: 'explore-stays', label: 'Explore stays', icon: '🏡' },
  { id: 'offline-map', label: 'Offline map', icon: '📍' },
  { id: 'sos', label: 'SOS', icon: '🆘' },
];

export const HOST_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'listings', label: 'Listings', icon: '🏠' },
  { id: 'earnings', label: 'Earnings', icon: '💰' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
];

export const GUIDE_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'tour-types', label: 'Tour types', icon: '🎯' },
];

export function getTabBarForRole(role: HomeRole): TabBarItem[] {
  switch (role) {
    case 'HOST':
      return HOST_TAB_ITEMS;
    case 'GUIDE':
      return GUIDE_TAB_ITEMS;
    case 'STUDENT':
    case 'TOURIST':
    case 'BROWSE':
    default:
      return SEEKER_TAB_ITEMS;
  }
}

export function getQuickActionsForRole(role: HomeRole): QuickActionItem[] {
  switch (role) {
    case 'STUDENT':
      return STUDENT_QUICK_ACTIONS;
    case 'TOURIST':
    case 'BROWSE':
      return TOURIST_QUICK_ACTIONS;
    case 'HOST':
      return HOST_QUICK_ACTIONS;
    case 'GUIDE':
      return GUIDE_QUICK_ACTIONS;
    default:
      return STUDENT_QUICK_ACTIONS;
  }
}

export function homeRoleFromIntent(
  intent: PrimaryIntent | null | undefined,
): HomeRole {
  if (intent === 'HOST') return 'HOST';
  if (intent === 'GUIDE') return 'GUIDE';
  if (intent === 'TOURIST') return 'TOURIST';
  if (intent === 'STUDENT') return 'STUDENT';
  return 'BROWSE';
}

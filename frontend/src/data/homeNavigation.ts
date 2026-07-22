import type { TabBarItem } from '../components/AppTabBar';
import type { QuickActionItem } from '../components/QuickActionsGrid';
import type { PrimaryIntent } from '../types/accountProfile';

export type HomeRole = PrimaryIntent | 'BROWSE' | 'STAFF';

export const SEEKER_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'explore', label: 'Explore', icon: 'compass-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const STAFF_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Ops', icon: 'grid-outline' },
  { id: 'users', label: 'Users', icon: 'people-outline' },
  { id: 'moderation', label: 'Moderation', icon: 'shield-checkmark-outline' },
  { id: 'preview', label: 'Preview', icon: 'eye-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const HOST_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'requests', label: 'Requests', icon: 'documents-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const GUIDE_TAB_ITEMS: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'earnings', label: 'Earnings', icon: 'cash-outline' },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

/**
 * Student / tourist home quick actions: only keep items that are NOT already
 * in Explore. Discovery (hosts, stays, attractions, tips) lives on Explore,
 * so seeker home grids stay empty.
 */

export const TOURIST_QUICK_ACTIONS: QuickActionItem[] = [];

/** Hosts/guides have no Explore tab — quick action is the entry. */
export const HOST_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'listings', label: 'Listings', icon: '🏠' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'earnings', label: 'Earnings', icon: '💰' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
];

export const GUIDE_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'calendar', label: 'Availability', icon: '📅' },
  { id: 'tour-types', label: 'Tour types', icon: '🎯' },
  { id: 'earnings', label: 'Earnings', icon: '💰' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
];

export function getTabBarForRole(role: HomeRole): TabBarItem[] {
  switch (role) {
    case 'STAFF':
      return STAFF_TAB_ITEMS;
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
    case 'TOURIST':
    case 'BROWSE':
      return [];
    case 'HOST':
      return HOST_QUICK_ACTIONS;
    case 'GUIDE':
      return GUIDE_QUICK_ACTIONS;
    default:
      return [];
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

/** Effective tab role for staff shell vs consumer preview. */
export function homeRoleForSession(
  isStaffShell: boolean,
  previewRole: PrimaryIntent | null | undefined,
  intent: PrimaryIntent | null | undefined,
): HomeRole {
  if (isStaffShell) return 'STAFF';
  if (previewRole) return homeRoleFromIntent(previewRole);
  return homeRoleFromIntent(intent);
}

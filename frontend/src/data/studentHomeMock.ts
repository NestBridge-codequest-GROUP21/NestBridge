import type { StudentHomeDashboardProps, SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import {
  getTabBarForRole,
  getQuickActionsForRole,
  homeRoleFromIntent,
} from './homeNavigation';
import {
  studentFeaturedMatchForCity,
  studentFeaturedMatchMock,
  studentStatusMock,
  studentReminderMock,
  studentRecentActivityMock,
  studentRecommendedMock,
} from './homeContentMock';
import { DEMO_ACTOR_ACCOUNTS, demoFirstName, demoInitials } from './demoAccounts';
import { normalizeCity } from './ghanaReference';

const studentDemoAccount =
  DEMO_ACTOR_ACCOUNTS.find((account) => account.id === 'student') ??
  DEMO_ACTOR_ACCOUNTS[0];

export const demoStudentFirstName = demoFirstName(studentDemoAccount.name);
export const demoStudentInitials = demoInitials(studentDemoAccount.name);

export const allSuggestedHostsMock: SuggestedHostItem[] = [
  {
    id: 'host-1',
    name: 'Abena Mensah',
    matchPercentage: 96,
    location: 'East Legon, Accra',
    pricePerNight: 'GHS 180/night',
  },
  {
    id: 'host-2',
    name: 'Kwame & Grace Asante',
    matchPercentage: 91,
    location: 'Cantonments, Accra',
    pricePerNight: 'GHS 220/night',
  },
  {
    id: 'host-5',
    name: 'Ama Serwaa Osei',
    matchPercentage: 90,
    location: 'Adum, Kumasi',
    pricePerNight: 'GHS 150/night',
  },
  {
    id: 'host-6',
    name: 'Kofi Mensah',
    matchPercentage: 87,
    location: 'Ayeduase, Kumasi',
    pricePerNight: 'GHS 130/night',
  },
  {
    id: 'host-11',
    name: 'Abena Mensah-Quaye',
    matchPercentage: 82,
    location: 'Pedu, Cape Coast',
    pricePerNight: 'GHS 95/night',
  },
];

export function suggestedHostsForCity(city: string): SuggestedHostItem[] {
  const normalized = normalizeCity(city).toLowerCase();
  if (!normalized) return allSuggestedHostsMock;

  const filtered = allSuggestedHostsMock.filter((host) =>
    host.location.toLowerCase().includes(normalized),
  );
  return filtered;
}

/** Default Accra subset for backwards-compatible imports. */
export const suggestedHostsMock: SuggestedHostItem[] =
  suggestedHostsForCity('Accra');

export const studentHomeMockData: Omit<
  StudentHomeDashboardProps,
  | 'onNotificationPress'
  | 'onFeaturedMatchPress'
  | 'onRecommendedSectionPress'
  | 'onQuickActionPress'
  | 'onReminderPress'
  | 'onTabPress'
> = {
  greeting: 'Good morning',
  userName: demoStudentFirstName,
  userInitials: demoStudentInitials,
  statusIcon: studentStatusMock.icon,
  statusLabel: studentStatusMock.label,
  notificationCount: 2,
  featuredMatch: studentFeaturedMatchMock,
  quickActions: getQuickActionsForRole('STUDENT'),
  recommendedSections: studentRecommendedMock,
  recommendedSectionTitle: 'Recommended for you',
  recentActivity: studentRecentActivityMock,
  reminder: studentReminderMock,
  tabBarItems: getTabBarForRole('STUDENT'),
  activeTabId: 'home',
};

export function studentHomeMockDataForCity(city: string): typeof studentHomeMockData {
  return {
    ...studentHomeMockData,
    featuredMatch: studentFeaturedMatchForCity(city),
    statusLabel: `Heading to ${city.split(',')[0]?.trim() || city} soon`,
  };
}

export function tabBarWithBadgesForRole(
  role: ReturnType<typeof homeRoleFromIntent>,
  unreadCount: number,
  incomingCount: number,
) {
  return getTabBarForRole(role).map((tab) => {
    if (tab.id === 'bookings' && unreadCount > 0) {
      return { ...tab, badgeCount: unreadCount };
    }
    if (tab.id === 'messages' && unreadCount > 0) {
      return { ...tab, badgeCount: unreadCount };
    }
    if (tab.id === 'requests' && incomingCount > 0) {
      return { ...tab, badgeCount: incomingCount };
    }
    return tab;
  });
}

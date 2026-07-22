import type { StudentHomeDashboardProps, SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import {
  getTabBarForRole,
  homeRoleFromIntent,
} from './homeNavigation';
import {
  studentFeaturedMatchForCity,
  studentFeaturedMatchMock,
  studentStatusMock,
  studentReminderMock,
  studentRecentActivityMock,
} from './homeContentMock';
import { DEMO_ACTOR_ACCOUNTS, demoFirstName, demoInitials } from './demoAccounts';
import { normalizeCity, recommendationSearchCities } from './ghanaReference';

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
  {
    id: 'host-damongo-1',
    name: 'Issah & Mariama Fuseini',
    matchPercentage: 88,
    location: 'Damongo, Savannah Region',
    pricePerNight: 'GHS 110/night',
  },
  {
    id: 'host-tamale-1',
    name: 'Abdul & Fatima Seidu',
    matchPercentage: 85,
    location: 'Tamale, Northern Region',
    pricePerNight: 'GHS 120/night',
  },
];

export function suggestedHostsForCity(city: string): SuggestedHostItem[] {
  const normalized = normalizeCity(city).toLowerCase();
  if (!normalized) return allSuggestedHostsMock;

  const cluster = recommendationSearchCities(city).map((entry) =>
    entry.toLowerCase(),
  );
  const filtered = allSuggestedHostsMock.filter((host) => {
    const location = host.location.toLowerCase();
    return cluster.some(
      (hub) => location.includes(hub) || hub.includes(normalized),
    );
  });
  return filtered;
}

/** Default Accra subset for backwards-compatible imports. */
export const suggestedHostsMock: SuggestedHostItem[] =
  suggestedHostsForCity('Accra');

export const studentHomeMockData: Omit<
  StudentHomeDashboardProps,
  | 'onNotificationPress'
  | 'onFeaturedMatchPress'
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

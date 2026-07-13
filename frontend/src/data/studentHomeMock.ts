import type { StudentHomeDashboardProps, SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import {
  getTabBarForRole,
  getQuickActionsForRole,
  homeRoleFromIntent,
} from './homeNavigation';
import {
  studentFeaturedMatchMock,
  studentStatusMock,
  studentReminderMock,
  studentRecentActivityMock,
  studentRecommendedMock,
} from './homeContentMock';

export const suggestedHostsMock: SuggestedHostItem[] = [
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
];

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
  userName: 'Akosua Darko',
  userInitials: 'AD',
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

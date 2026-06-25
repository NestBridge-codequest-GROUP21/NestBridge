import type { StudentHomeDashboardProps } from '../screens/student/StudentHomeDashboard';
import type { TabBarItem } from '../components/AppTabBar';

export const studentHomeMockData: StudentHomeDashboardProps = {
  greeting: 'Good morning',
  userName: 'Akosua Darko',
  userInitials: 'AD',
  searchPlaceholder: 'Search city or university area',
  matchAlert: {
    count: 3,
    subtitle: 'Based on your profile',
  },
  quickActions: [
    { id: 'find-hosts', label: 'Find hosts', icon: '🏠' },
    { id: 'guides', label: 'Guides', icon: '🗺️' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
  ],
  suggestedHosts: [
    {
      id: 'host-1',
      name: 'Abena Mensah',
      matchPercentage: 96,
      location: 'East Legon, Accra',
      pricePerNight: 'GHS 180/night',
    },
    {
      id: 'host-2',
      name: 'Kwame & Grace',
      matchPercentage: 91,
      location: 'Cantonments, Accra',
      pricePerNight: 'GHS 220/night',
    },
  ],
  tabBarItems: [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' },
  ] as TabBarItem[],
  activeTabId: 'home',
};

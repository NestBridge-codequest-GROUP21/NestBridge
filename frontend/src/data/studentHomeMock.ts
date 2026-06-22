import type { StudentHomeDashboardProps } from '../screens/student/StudentHomeDashboard';

export const studentHomeMockData: StudentHomeDashboardProps = {
  greeting: 'Good morning 👋',
  userName: 'Akosua Darko',
  userInitials: 'AD',
  searchPlaceholder: 'Search city, university area...',
  matchAlert: {
    count: 3,
    subtitle: 'Based on your preferences',
  },
  quickActions: [
    { id: 'find-hosts', label: 'Find Hosts', icon: '🔍' },
    { id: 'guides', label: 'Guides', icon: '🗺️' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'messages', label: 'Messages', icon: '💬' },
  ],
  suggestedHosts: [
    {
      id: 'host-1',
      name: 'Abena Mensah',
      matchPercentage: 96,
      location: 'East Legon, Accra',
      pricePerNight: 'GHS 180/night',
      icon: '🏡',
    },
    {
      id: 'host-2',
      name: 'Kwame & Grace',
      matchPercentage: 91,
      location: 'Cantonments, Accra',
      pricePerNight: 'GHS 220/night',
      icon: '🏡',
    },
  ],
  tabBarItems: [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  activeTabId: 'home',
};

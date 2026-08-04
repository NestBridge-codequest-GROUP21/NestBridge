import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabBarItem } from '../components/AppTabBar';
import type { PrimaryIntent } from '../types/accountProfile';
import type { HomeRoute } from '../utils/accountProfile';
import { AppStack } from './appStack';
import {
  AdminHomeRoute,
  AdminModerationRoute,
  AdminPreviewRoute,
  StaffPendingKycRoute,
  StaffUserActivityRoute,
  StaffUserDetailRoute,
  StaffUserSearchRoute,
} from './staffRoutes';
import type { AppStackParamList } from './types';
import { navigateToHome } from './tabRouting';

const Stack = AppStack;

type Nav = NativeStackNavigationProp<AppStackParamList>;

export interface StaffStackScreensProps {
  staffName: string;
  staffTabBarItems: TabBarItem[];
  isStaffShell: boolean;
  notificationCount: number;
  onTabPress: (
    navigation: Nav,
    tabId: string,
    contextHomeRoute?: HomeRoute,
  ) => void;
  openNotifications: (navigation: Nav) => void;
  enterAppPreview: (role: PrimaryIntent) => void | Promise<void>;
}

/**
 * Admin/staff Stack.Screen registrations.
 * Call as a function inside Stack.Navigator (not as JSX) so React Navigation
 * sees Screen children instead of a custom component wrapper.
 */
export function renderStaffStackScreens({
  staffName,
  staffTabBarItems,
  isStaffShell,
  notificationCount,
  onTabPress,
  openNotifications,
  enterAppPreview,
}: StaffStackScreensProps) {
  return (
    <Stack.Group>
      <Stack.Screen name="AdminHome">
        {({ navigation }) => (
          <AdminHomeRoute
            staffName={staffName}
            tabBarItems={staffTabBarItems}
            onTabPress={(tabId) => onTabPress(navigation, tabId, 'AdminHome')}
            onOpenUsers={() => navigation.navigate('StaffUserSearch')}
            onOpenUsersByCategory={(category) =>
              navigation.navigate('StaffUserSearch', { category })
            }
            onOpenPendingKyc={() => navigation.navigate('StaffPendingKyc')}
            onOpenModeration={() => navigation.navigate('AdminModeration')}
            onOpenPreview={() => navigation.navigate('AdminPreview')}
            onOpenProfile={() => navigation.navigate('Profile')}
            notificationCount={notificationCount}
            onNotificationPress={() => openNotifications(navigation)}
            onSosPress={() => navigation.navigate('SOS')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="AdminModeration">
        {({ navigation }) => (
          <AdminModerationRoute
            tabBarItems={staffTabBarItems}
            onTabPress={(tabId) => onTabPress(navigation, tabId, 'AdminHome')}
            onBack={() => navigateToHome(navigation, 'AdminHome')}
            onSosPress={() => navigation.navigate('SOS')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="AdminPreview">
        {({ navigation }) => (
          <AdminPreviewRoute
            tabBarItems={staffTabBarItems}
            onTabPress={(tabId) => onTabPress(navigation, tabId, 'AdminHome')}
            onSelectRole={(role) => {
              void enterAppPreview(role);
            }}
            onBack={() => navigateToHome(navigation, 'AdminHome')}
            onSosPress={() => navigation.navigate('SOS')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffUserSearch">
        {({ navigation, route }) => (
          <StaffUserSearchRoute
            initialCategory={route.params?.category ?? 'ALL'}
            tabBarItems={isStaffShell ? staffTabBarItems : undefined}
            onTabPress={
              isStaffShell
                ? (tabId) => onTabPress(navigation, tabId, 'AdminHome')
                : undefined
            }
            onSosPress={() => navigation.navigate('SOS')}
            onSelectUser={(userId) =>
              navigation.navigate('StaffUserDetail', { userId })
            }
            onBack={() =>
              isStaffShell
                ? navigateToHome(navigation, 'AdminHome')
                : navigation.goBack()
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffUserDetail">
        {({ navigation, route }) => (
          <StaffUserDetailRoute
            userId={route.params.userId}
            onViewActivity={(userId, userName) =>
              navigation.navigate('StaffUserActivity', { userId, userName })
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffUserActivity">
        {({ navigation, route }) => (
          <StaffUserActivityRoute
            userId={route.params.userId}
            userName={route.params.userName}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffPendingKyc">
        {({ navigation }) => (
          <StaffPendingKycRoute
            tabBarItems={isStaffShell ? staffTabBarItems : undefined}
            onTabPress={
              isStaffShell
                ? (tabId) => onTabPress(navigation, tabId, 'AdminHome')
                : undefined
            }
            onSosPress={() => navigation.navigate('SOS')}
            onSelectUser={(userId) =>
              navigation.navigate('StaffUserDetail', { userId })
            }
            onBack={() =>
              isStaffShell
                ? navigateToHome(navigation, 'AdminHome')
                : navigation.goBack()
            }
          />
        )}
      </Stack.Screen>
    </Stack.Group>
  );
}

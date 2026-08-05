import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/api';
import type { AppNotification } from '../types/booking';
import type { PrimaryIntent } from '../types/accountProfile';
import type { AppStackParamList } from './types';
import { appAlert } from '../utils/appAlert';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export interface NotificationsRouteProps {
  navigation: Nav;
  userName: string;
  userInitials: string;
  notifications: AppNotification[];
  isLoading?: boolean;
  primaryIntent: PrimaryIntent | null | undefined;
  isStaff: boolean;
  hostIncomingIds: string[];
  guideIncomingIds: string[];
  refreshNotificationState: () => Promise<void>;
  refreshSession: () => Promise<unknown>;
}

export function NotificationsRoute({
  navigation,
  userName,
  userInitials,
  notifications,
  isLoading = false,
  primaryIntent,
  isStaff,
  hostIncomingIds,
  guideIncomingIds,
  refreshNotificationState,
  refreshSession,
}: NotificationsRouteProps) {
  const openRelatedBooking = (relatedBookingId: string) => {
    if (primaryIntent === 'HOST') {
      if (hostIncomingIds.includes(relatedBookingId)) {
        navigation.navigate('MatchRequestReview', {
          requestId: relatedBookingId,
        });
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'HostBookingsTab' }],
      });
      return;
    }
    if (primaryIntent === 'GUIDE') {
      if (guideIncomingIds.includes(relatedBookingId)) {
        navigation.navigate('SessionReview', {
          requestId: relatedBookingId,
        });
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'GuideBookingsTab' }],
      });
      return;
    }
    navigation.navigate('StudentBookings');
  };

  const navigateAfterNotification = async (notification: AppNotification) => {
    if (
      notification.type === 'KYC_APPROVED' ||
      notification.type === 'KYC_REJECTED'
    ) {
      if (notification.type === 'KYC_APPROVED') {
        await refreshSession();
      }
      navigation.navigate('VerificationStatus');
      return;
    }
    // Staff: identity review request → open that user for Accept / Decline.
    if (isStaff && notification.type === 'KYC_PENDING') {
      if (notification.relatedUserId) {
        navigation.navigate('StaffUserDetail', {
          userId: notification.relatedUserId,
        });
        return;
      }
      navigation.navigate('StaffPendingKyc');
      return;
    }
    if (notification.relatedUserId && isStaff) {
      navigation.navigate('StaffUserDetail', {
        userId: notification.relatedUserId,
      });
      return;
    }
    if (notification.relatedBookingId) {
      openRelatedBooking(notification.relatedBookingId);
    }
  };

  return (
    <NotificationsScreen
      userName={userName}
      userInitials={userInitials}
      notifications={notifications}
      isLoading={isLoading}
      onBack={() => navigation.goBack()}
      onEmptyPrimaryAction={() => {
        if (primaryIntent === 'HOST') {
          navigation.reset({ index: 0, routes: [{ name: 'HostHome' }] });
          return;
        }
        if (primaryIntent === 'GUIDE') {
          navigation.reset({ index: 0, routes: [{ name: 'GuideHome' }] });
          return;
        }
        if (primaryIntent === 'TOURIST') {
          navigation.reset({ index: 0, routes: [{ name: 'ExploreHome' }] });
          return;
        }
        navigation.reset({ index: 0, routes: [{ name: 'StudentHome' }] });
      }}
      onMarkAllRead={() => {
        void (async () => {
          try {
            await markAllNotificationsRead();
            await refreshNotificationState();
          } catch {
            appAlert('Notifications', 'Could not mark all as read.');
          }
        })();
      }}
      onNotificationPress={(notification) => {
        void (async () => {
          // Navigate first so the tap feels instant; mark-read can finish after.
          void navigateAfterNotification(notification);
          try {
            if (!notification.read) {
              await markNotificationRead(notification.id);
              await refreshNotificationState();
            }
          } catch {
            // Ignore mark-read failures — destination already opened.
          }
        })();
      }}
    />
  );
}

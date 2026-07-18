import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { registerDeviceToken } from './api';
import { devicePlatformLabel } from './paymentFlow';

/**
 * Registers for push silently after sign-in.
 * Fully defensive: missing Expo projectId, permissions, or native modules must never crash startup.
 */
export async function registerPushTokenIfAvailable(): Promise<void> {
  try {
    const Device = await import('expo-device');
    if (!Device.isDevice) {
      return;
    }

    const Notifications = await import('expo-notifications');

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Constants as any).easConfig?.projectId;
    if (!projectId || typeof projectId !== 'string') {
      console.warn('[push] skipped — EAS projectId not configured');
      return;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'NestBridge',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenResponse.data;
    if (!token) {
      return;
    }

    try {
      await registerDeviceToken(token, devicePlatformLabel());
    } catch {
      // Non-blocking — badges still work via in-app notifications API
    }
  } catch (error) {
    console.warn('[push] registration skipped', error);
  }
}

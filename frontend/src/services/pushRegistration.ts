import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerDeviceToken } from './api';
import { devicePlatformLabel } from './paymentFlow';

/** Registers for push silently after sign-in — no UI changes. */
export async function registerPushTokenIfAvailable(): Promise<void> {
  if (!Device.isDevice) {
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

  const tokenResponse = await Notifications.getExpoPushTokenAsync();
  const token = tokenResponse.data;
  if (!token) {
    return;
  }

  try {
    await registerDeviceToken(token, devicePlatformLabel());
  } catch {
    // Non-blocking — badges still work via in-app notifications API
  }
}

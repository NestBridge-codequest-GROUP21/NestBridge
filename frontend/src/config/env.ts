import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Hostname from the Expo dev server (same LAN IP Expo Go uses). */
function devServerHost(): string | undefined {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (
      Constants.manifest2 as
        | { extra?: { expoClient?: { hostUri?: string } } }
        | null
        | undefined
    )?.extra?.expoClient?.hostUri;
  if (!hostUri) {
    return undefined;
  }
  const host = hostUri.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return undefined;
  }
  return host;
}

function resolveApiBaseUrl(): string {
  const override = Constants.expoConfig?.extra?.apiBaseUrl;
  if (typeof override === 'string' && override.length > 0) {
    return override.replace(/\/$/, '');
  }

  // Physical device: reuse the Expo dev server IP so API hits the same machine.
  const lanHost = devServerHost();
  if (lanHost) {
    return `http://${lanHost}:8080`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  return 'http://localhost:8080';
}

/** Override via app.json `expo.extra.apiBaseUrl` if needed. */
export const API_BASE_URL = resolveApiBaseUrl();

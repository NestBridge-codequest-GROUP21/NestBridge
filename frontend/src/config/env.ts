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

function isLoopbackUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function resolveApiBaseUrl(): string {
  try {
    const override = Constants.expoConfig?.extra?.apiBaseUrl;
    const hasOverride = typeof override === 'string' && override.length > 0;
    const lanHost = devServerHost();

    // Explicit non-loopback override always wins (e.g. staging URL or LAN IP).
    if (hasOverride && !isLoopbackUrl(override)) {
      return override.replace(/\/$/, '');
    }

    // Physical device / Expo Go: hit the same machine as Metro, not the phone's localhost.
    if (lanHost) {
      return `http://${lanHost}:8080`;
    }

    // Loopback override is fine for simulators / web when no LAN host is available.
    if (hasOverride) {
      return override.replace(/\/$/, '');
    }
  } catch {
    // Constants/extra can be unavailable in odd standalone boot states.
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  return 'http://localhost:8080';
}

/**
 * Resolved at runtime.
 * - Expo Go on a phone → http://<Metro LAN IP>:8080
 * - Android emulator → http://10.0.2.2:8080
 * - Optional: set expo.extra.apiBaseUrl to a real host (not localhost) to force a URL
 */
export const API_BASE_URL = resolveApiBaseUrl();

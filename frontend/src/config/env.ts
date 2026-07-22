import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Same host as EAS / app.json — used when Expo extra fails to load. */
const PRODUCTION_API_BASE_URL = 'https://nestbridge-production.up.railway.app';

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

function readExtraApiBaseUrl(): string | undefined {
  const extras: unknown[] = [
    Constants.expoConfig?.extra?.apiBaseUrl,
    (
      Constants as {
        manifest?: { extra?: { apiBaseUrl?: string } };
      }
    ).manifest?.extra?.apiBaseUrl,
    (
      Constants.manifest2 as
        | { extra?: { apiBaseUrl?: string } }
        | null
        | undefined
    )?.extra?.apiBaseUrl,
  ];
  for (const value of extras) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim().replace(/\/$/, '');
    }
  }
  return undefined;
}

function preferLanApi(): boolean {
  const flag = Constants.expoConfig?.extra?.useLanApi;
  if (flag === true || flag === 'true') {
    return true;
  }
  return process.env.EXPO_PUBLIC_USE_LAN_API === 'true';
}

function resolveApiBaseUrl(): string {
  try {
    const override = readExtraApiBaseUrl();
    const lanHost = devServerHost();

    // Explicit non-loopback override always wins (Railway, staging, or a LAN IP string).
    if (override && !isLoopbackUrl(override)) {
      return override;
    }

    // Local backend only when explicitly requested — otherwise Expo Go phones
    // hit dead http://<metro-ip>:8080 and show "Cannot reach NestBridge".
    if (preferLanApi() && lanHost) {
      return `http://${lanHost}:8080`;
    }

    if (override) {
      return override;
    }
  } catch {
    // Constants/extra can be unavailable in odd standalone boot states.
  }

  // Safe default for Expo Go / devices: production API, not unreachable LAN.
  if (Platform.OS === 'android' && preferLanApi()) {
    return 'http://10.0.2.2:8080';
  }

  return PRODUCTION_API_BASE_URL;
}

/**
 * Resolved at runtime.
 * - Default / EAS: https://nestbridge-production.up.railway.app
 * - Local backend: set expo.extra.useLanApi=true or EXPO_PUBLIC_USE_LAN_API=true
 * - Or set expo.extra.apiBaseUrl to a full URL (LAN IP or Railway)
 */
export const API_BASE_URL = resolveApiBaseUrl();

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('[NestBridge] API_BASE_URL =', API_BASE_URL);
}

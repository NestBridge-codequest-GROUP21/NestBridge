import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Source of truth for EAS / standalone builds.
 * Keep this defensive: missing Firebase env vars must not break the binary.
 *
 * newArchEnabled is false for preview/production stability — New Architecture has
 * caused immediate launch crashes with some Expo native modules on SDK 54.
 */
const base: ExpoConfig = {
  name: 'NestBridge',
  slug: 'nestbridge',
  owner: 'behackie03',
  version: '1.0.1',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nestbridge.app',
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'NestBridge uses your photos so you can add a profile picture.',
      LSApplicationQueriesSchemes: ['mailto', 'tel'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    edgeToEdgeEnabled: true,
    // Let the app handle inset via ScreenScroll / KeyboardSafeView (edge-to-edge
    // often breaks adjustResize; pan + our padding keeps focused inputs visible).
    softwareKeyboardLayoutMode: 'pan',
    package: 'com.nestbridge.app',
    permissions: [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_EXTERNAL_STORAGE',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        category: ['BROWSABLE', 'DEFAULT'],
        data: [
          {
            scheme: 'nestbridge',
            host: 'reset-password',
          },
        ],
      },
    ],
  },
  scheme: 'nestbridge',
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-secure-store',
    'expo-font',
    'expo-web-browser',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow NestBridge to access your photos for a profile picture.',
      },
    ],
    '@react-native-community/datetimepicker',
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#1AA68C',
      },
    ],
    './plugins/withAndroidMailtoQuery.js',
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...base,
  android: {
    ...config.android,
    ...base.android,
  },
  ios: {
    ...config.ios,
    ...base.ios,
  },
  plugins: base.plugins,
  extra: {
    ...config.extra,
    // Env wins; otherwise keep app.json; never blank out a configured URL (blank
    // forces Expo Go onto LAN:8080, which phones often cannot reach → "No network").
    apiBaseUrl:
      process.env.API_BASE_URL ??
      process.env.EXPO_PUBLIC_API_BASE_URL ??
      (typeof config.extra?.apiBaseUrl === 'string' && config.extra.apiBaseUrl
        ? config.extra.apiBaseUrl
        : 'https://nestbridge-production.up.railway.app'),
    enableDemoFallback: process.env.EXPO_PUBLIC_ENABLE_DEMO_FALLBACK !== 'false',
    // Empty strings are intentional — chat falls back to REST when unset.
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    firebaseDatabaseUrl: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ?? '',
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    eas: {
      ...(typeof config.extra?.eas === 'object' && config.extra.eas
        ? config.extra.eas
        : {}),
      projectId:
        process.env.EAS_PROJECT_ID ||
        ((config.extra as { eas?: { projectId?: string } } | undefined)?.eas
          ?.projectId ||
          '6da19fa0-dbf6-42e2-b6ac-32b29cb37aa9'),
    },
  },
});

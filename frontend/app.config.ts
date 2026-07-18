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
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0C1735',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nestbridge.app',
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'NestBridge uses your photos so you can add a profile picture.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0C1735',
    },
    edgeToEdgeEnabled: true,
    package: 'com.nestbridge.app',
    permissions: [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_EXTERNAL_STORAGE',
    ],
  },
  scheme: 'nestbridge',
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-secure-store',
    'expo-font',
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
    apiBaseUrl:
      process.env.API_BASE_URL ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
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
        process.env.EAS_PROJECT_ID ??
        (config.extra as { eas?: { projectId?: string } } | undefined)?.eas
          ?.projectId ??
        '05eaad69-0d05-4eb9-b956-028c11e08f92',
    },
  },
});

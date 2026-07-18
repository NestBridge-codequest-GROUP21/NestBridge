import type { ExpoConfig } from 'expo/config';

const base: ExpoConfig = {
  name: 'NestBridge',
  slug: 'nestbridge',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nestbridge.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.nestbridge.app',
  },
  scheme: 'nestbridge',
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-secure-store',
    'expo-font',
    'expo-image-picker',
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

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  ...base,
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.API_BASE_URL ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
    enableDemoFallback:
      process.env.EXPO_PUBLIC_ENABLE_DEMO_FALLBACK !== 'false',
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    firebaseDatabaseUrl: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ?? '',
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  },
});

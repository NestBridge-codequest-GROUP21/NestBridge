import Constants from 'expo-constants';

/**
 * When true (default), empty API responses show Ghana demo data for CodeQuest judges.
 * Set EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false in EAS production profile before real launch.
 */
export function isDemoFallbackEnabled(): boolean {
  const flag = Constants.expoConfig?.extra?.enableDemoFallback;
  if (flag === false || flag === 'false') {
    return false;
  }
  return true;
}

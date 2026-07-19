import Constants from 'expo-constants';
import { DEMO_ACTOR_ACCOUNTS } from '../data/demoAccounts';

/**
 * When true (default), empty API responses show Ghana demo data for CodeQuest judges.
 * Set EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false in EAS production profile before real launch.
 */
export function isDemoFallbackEnabled(): boolean {
  try {
    const flag = Constants.expoConfig?.extra?.enableDemoFallback;
    if (flag === false || flag === 'false') {
      return false;
    }
  } catch {
    // Keep demo fallback on if Constants is unavailable.
  }
  return true;
}

/** Demo actor buttons on Welcome / Login / Register — same flag as demo fallback. */
export function isDemoQuickLoginEnabled(): boolean {
  return isDemoFallbackEnabled();
}

export function isDemoActorEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return DEMO_ACTOR_ACCOUNTS.some((account) => account.email.toLowerCase() === normalized);
}

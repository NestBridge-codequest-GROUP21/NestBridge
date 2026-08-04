import Constants from 'expo-constants';
import { ALL_DEMO_ACCOUNTS } from '../data/demoAccounts';

/**
 * Global kill switch for mock/fallback content after a demo actor signs in.
 * Set EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false in EAS production to disable for everyone.
 */
export function isDemoFallbackEnabled(): boolean {
  try {
    const flag = Constants.expoConfig?.extra?.enableDemoFallback;
    if (flag === false || flag === 'false') {
      return false;
    }
  } catch {
    // Keep demo fallback on if Constants is unavailable (dev / Expo Go).
  }
  return true;
}

/**
 * Welcome-screen Quick sign-in tiles.
 * Off for now — demo actors still work via email/password Sign in.
 * Flip to `return isDemoFallbackEnabled()` when bringing tiles back.
 */
export function isDemoQuickLoginEnabled(): boolean {
  return false;
}

/**
 * Demo accounts are identified by exact email match against the seeded list in
 * `data/demoAccounts.ts` (ALL_DEMO_ACCOUNTS):
 *   - akosua.demo@nestbridge.app (Student)
 *   - zara.tourist@nestbridge.app (Tourist)
 *   - abena.host@nestbridge.app (Host family)
 *   - kofi.guide@nestbridge.app (Local guide)
 *
 * Staff/ops uses personal allowlisted Gmails only (not a shared demo admin).
 * Not by domain alone: a real user who registers with any other address
 * (including a non-seeded *@nestbridge.app address) is treated as a production account.
 */
export function isDemoActorEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return ALL_DEMO_ACCOUNTS.some((account) => account.email.toLowerCase() === normalized);
}

/**
 * Per-account gate for mock/fallback content.
 * Requires BOTH the global flag and a seeded demo actor email for the
 * currently signed-in user. Real Create Account users always get live data
 * (or genuine empty states) even when the global flag is still on for judges.
 */
export function shouldUseDemoFallbackForAccount(
  email: string | null | undefined,
): boolean {
  return isDemoFallbackEnabled() && isDemoActorEmail(email);
}

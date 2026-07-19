import * as SecureStore from 'expo-secure-store';

const BOOT_ERROR_KEY = 'nestbridge_last_boot_error';

export type BootStage =
  | 'js_entry'
  | 'fonts'
  | 'providers_mount'
  | 'auth_hydrate_start'
  | 'auth_session_loaded'
  | 'auth_refresh'
  | 'auth_hydrate_done'
  | 'profile_hydrate_start'
  | 'profile_hydrate_done'
  | 'splash_waiting'
  | 'splash_dismissed'
  | 'nav_ready'
  | 'push_register'
  | 'fatal';

type BootErrorRecord = {
  stage: string;
  message: string;
  at: string;
};

let currentStage: BootStage | 'unknown' = 'unknown';
let lastErrorMessage: string | null = null;

function safeString(value: unknown): string {
  if (value instanceof Error) {
    return value.message || value.name || 'Error';
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** In-memory breadcrumb for the current cold start (also logged). */
export function setBootStage(stage: BootStage): void {
  currentStage = stage;
  console.log(`[boot] ${stage}`);
}

export function getBootStage(): string {
  return currentStage;
}

export function getLastBootErrorMessage(): string | null {
  return lastErrorMessage;
}

/** Persist a boot/startup failure so the next launch can surface it without adb. */
export async function recordBootError(
  stage: string,
  error: unknown,
): Promise<void> {
  const message = safeString(error);
  lastErrorMessage = message;
  console.error(`[boot:error] ${stage}`, message);
  try {
    const payload: BootErrorRecord = {
      stage,
      message: message.slice(0, 800),
      at: new Date().toISOString(),
    };
    await SecureStore.setItemAsync(BOOT_ERROR_KEY, JSON.stringify(payload));
  } catch (persistError) {
    console.warn('[boot] could not persist error', persistError);
  }
}

export async function loadLastBootError(): Promise<BootErrorRecord | null> {
  try {
    const raw = await SecureStore.getItemAsync(BOOT_ERROR_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as BootErrorRecord;
    if (
      typeof parsed?.stage === 'string' &&
      typeof parsed?.message === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearLastBootError(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(BOOT_ERROR_KEY);
  } catch {
    // ignore
  }
}

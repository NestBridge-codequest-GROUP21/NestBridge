import * as SecureStore from 'expo-secure-store';
import type { CapabilitiesState } from '../types/capability';
import { createDefaultCapabilitiesState } from '../utils/capabilities';

const capabilityKey = (userId: string) => `nestbridge_capabilities_${userId}`;

export async function loadCapabilities(userId: string): Promise<CapabilitiesState> {
  const raw = await SecureStore.getItemAsync(capabilityKey(userId));
  if (!raw) {
    return createDefaultCapabilitiesState();
  }
  try {
    return JSON.parse(raw) as CapabilitiesState;
  } catch {
    return createDefaultCapabilitiesState();
  }
}

export async function saveCapabilities(
  userId: string,
  state: CapabilitiesState,
): Promise<void> {
  await SecureStore.setItemAsync(capabilityKey(userId), JSON.stringify(state));
}

export async function clearCapabilities(userId: string): Promise<void> {
  await SecureStore.deleteItemAsync(capabilityKey(userId));
}

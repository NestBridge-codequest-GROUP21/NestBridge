import { AppState, Linking, Platform } from 'react-native';
import {
  confirmBooking,
  getBookingById,
  initializeBookingPayment,
} from './api';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntilBookingConfirmed(
  bookingId: string,
  maxAttempts = 45,
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const booking = await getBookingById(bookingId);
    if (booking.status === 'CONFIRMED') {
      return true;
    }
    // Pause longer while the app is backgrounded (user is in Paystack browser).
    const delay = AppState.currentState === 'active' ? 2000 : 3000;
    await sleep(delay);
  }
  const finalCheck = await getBookingById(bookingId);
  return finalCheck.status === 'CONFIRMED';
}

/**
 * Uses existing mock confirm when Paystack is off; opens system browser when enabled.
 * Same "Pay now" entry point — no UI changes.
 */
export async function completeBookingPayment(bookingId: string): Promise<void> {
  const init = await initializeBookingPayment(bookingId);

  if (init.mockPayment) {
    await confirmBooking(bookingId);
    return;
  }

  if (!init.authorizationUrl) {
    throw new Error('Payment could not be started.');
  }

  const canOpen = await Linking.canOpenURL(init.authorizationUrl);
  if (!canOpen) {
    throw new Error('Cannot open payment page on this device.');
  }
  await Linking.openURL(init.authorizationUrl);

  const confirmed = await waitUntilBookingConfirmed(bookingId);
  if (confirmed) {
    return;
  }

  throw new Error(
    'Payment is processing. Return to Bookings and pull to refresh in a moment.',
  );
}

export function devicePlatformLabel(): string {
  return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown';
}

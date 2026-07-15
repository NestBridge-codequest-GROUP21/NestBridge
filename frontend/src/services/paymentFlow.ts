import { Linking, Platform } from 'react-native';
import {
  confirmBooking,
  getBookingById,
  initializeBookingPayment,
} from './api';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await sleep(2000);
    const booking = await getBookingById(bookingId);
    if (booking.status === 'CONFIRMED') {
      return;
    }
  }

  throw new Error(
    'Payment is processing. Return to Bookings and pull to refresh in a moment.',
  );
}

export function devicePlatformLabel(): string {
  return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown';
}

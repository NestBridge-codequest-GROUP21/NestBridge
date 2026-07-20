import { AppState, Linking, Platform } from 'react-native';
import {
  confirmBooking,
  getBookingById,
  initializeBookingPayment,
  type BookingApi,
} from './api';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait until the booking is CONFIRMED (webhook/callback) or until timeout.
 * Also re-checks immediately when the app returns to the foreground from Paystack.
 */
async function waitUntilBookingConfirmed(
  bookingId: string,
  maxAttempts = 60,
): Promise<BookingApi> {
  let resolveActive: (() => void) | null = null;
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active' && resolveActive) {
      resolveActive();
      resolveActive = null;
    }
  });

  try {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const booking = await getBookingById(bookingId);
      if (booking.status === 'CONFIRMED') {
        return booking;
      }

      const delay = AppState.currentState === 'active' ? 2000 : 3000;
      await Promise.race([
        sleep(delay),
        new Promise<void>((resolve) => {
          resolveActive = resolve;
        }),
      ]);
    }

    return getBookingById(bookingId);
  } finally {
    subscription.remove();
  }
}

export type PaymentCompletionResult = {
  booking: BookingApi;
  /** True when Paystack checkout was opened in the system browser. */
  usedCheckout: boolean;
  /** True when local mock confirm path was used (Paystack disabled). */
  mockPayment: boolean;
};

/**
 * Full payment orchestration for the Bookings "Pay now" CTA.
 *
 * - Paystack off → initialize returns mockPayment → confirm booking via API
 * - Paystack on → open authorization URL → poll/refresh until confirmed
 */
export async function completeBookingPayment(
  bookingId: string,
): Promise<PaymentCompletionResult> {
  const init = await initializeBookingPayment(bookingId);

  if (init.mockPayment) {
    const booking = await confirmBooking(bookingId);
    return { booking, usedCheckout: false, mockPayment: true };
  }

  if (!init.authorizationUrl) {
    throw new Error('Payment could not be started. Missing checkout URL.');
  }

  const canOpen = await Linking.canOpenURL(init.authorizationUrl);
  if (!canOpen) {
    throw new Error('Cannot open the Paystack checkout page on this device.');
  }

  await Linking.openURL(init.authorizationUrl);

  const booking = await waitUntilBookingConfirmed(bookingId);
  if (booking.status === 'CONFIRMED') {
    return { booking, usedCheckout: true, mockPayment: false };
  }

  throw new Error(
    'Payment is still processing. Return to Bookings and pull to refresh in a moment.',
  );
}

export function devicePlatformLabel(): string {
  return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown';
}

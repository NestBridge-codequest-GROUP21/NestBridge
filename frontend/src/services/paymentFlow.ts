import { AppState, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  confirmBooking,
  getBookingById,
  initializeBookingPayment,
  verifyBookingPayment,
  type BookingApi,
} from './api';

WebBrowser.maybeCompleteAuthSession();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type PaymentProgressPhase =
  | 'preparing'
  | 'opening_checkout'
  | 'awaiting_confirmation'
  | 'verifying'
  | 'success';

export type PaymentProgressHandler = (phase: PaymentProgressPhase, detail?: string) => void;

export class PaymentCancelledError extends Error {
  constructor(message = 'Payment was cancelled. Your booking is still waiting for payment.') {
    super(message);
    this.name = 'PaymentCancelledError';
  }
}

export class PaymentPendingError extends Error {
  constructor(
    message = 'Payment is still processing. If you were charged, pull to refresh Bookings in a moment.',
  ) {
    super(message);
    this.name = 'PaymentPendingError';
  }
}

/**
 * Wait until the booking is CONFIRMED (webhook/callback/verify) or until timeout.
 * Also re-checks immediately when the app returns to the foreground from Paystack.
 */
async function waitUntilBookingConfirmed(
  bookingId: string,
  maxAttempts = 45,
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
      try {
        const verified = await verifyBookingPayment(bookingId);
        if (verified.paid) {
          return getBookingById(bookingId);
        }
      } catch {
        // Fall through to booking poll.
      }

      const booking = await getBookingById(bookingId);
      if (booking.status === 'CONFIRMED' || booking.paymentStatus === 'PAID') {
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
  /** True when Paystack checkout was opened. */
  usedCheckout: boolean;
  /** True when local mock confirm path was used (Paystack disabled). */
  mockPayment: boolean;
  reference?: string;
  amount?: number;
  currency?: string;
};

export type CompleteBookingPaymentOptions = {
  onProgress?: PaymentProgressHandler;
};

/**
 * Single reusable payment orchestrator for every NestBridge "Pay now" CTA.
 *
 * - Paystack off → initialize returns mockPayment → confirm booking via API
 * - Paystack on → open authorization URL (cards + Mobile Money) → verify → confirm
 *
 * Never treats a booking as paid until the backend confirms CONFIRMED/PAID
 * (via Paystack verify, webhook, or mock confirm when Paystack is disabled).
 */
export async function completeBookingPayment(
  bookingId: string,
  options: CompleteBookingPaymentOptions = {},
): Promise<PaymentCompletionResult> {
  const { onProgress } = options;
  onProgress?.('preparing', 'Preparing payment...');

  const init = await initializeBookingPayment(bookingId);

  if (init.mockPayment) {
    onProgress?.('verifying', 'Confirming payment...');
    const booking = await confirmBooking(bookingId);
    onProgress?.('success', 'Payment Successful');
    return {
      booking,
      usedCheckout: false,
      mockPayment: true,
      amount: init.amount,
      currency: init.currency,
    };
  }

  if (!init.authorizationUrl) {
    throw new Error('Payment could not be started. Missing checkout URL.');
  }

  onProgress?.('opening_checkout', 'Opening Paystack...');
  const browserResult = await WebBrowser.openBrowserAsync(init.authorizationUrl, {
    dismissButtonStyle: 'close',
    showTitle: true,
    enableBarCollapsing: false,
    // Keep the session in-app so cancel returns here without losing booking context.
    createTask: false,
  });

  if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
    onProgress?.('verifying', 'Checking payment status...');
    // User may have paid then closed — always verify once.
    try {
      const verified = await verifyBookingPayment(bookingId);
      if (verified.paid) {
        const booking = await getBookingById(bookingId);
        onProgress?.('success', 'Payment Successful');
        return {
          booking,
          usedCheckout: true,
          mockPayment: false,
          reference: init.reference ?? verified.reference,
          amount: init.amount,
          currency: init.currency,
        };
      }
    } catch {
      // Treat as cancel if verify fails.
    }
    throw new PaymentCancelledError();
  }

  onProgress?.('awaiting_confirmation', 'Confirming payment with Paystack...');
  const booking = await waitUntilBookingConfirmed(bookingId);
  if (booking.status === 'CONFIRMED' || booking.paymentStatus === 'PAID') {
    onProgress?.('success', 'Payment Successful');
    return {
      booking,
      usedCheckout: true,
      mockPayment: false,
      reference: init.reference,
      amount: init.amount,
      currency: init.currency,
    };
  }

  throw new PaymentPendingError();
}

export function devicePlatformLabel(): string {
  return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown';
}

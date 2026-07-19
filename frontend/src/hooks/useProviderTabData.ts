import { useCallback, useEffect, useState } from 'react';
import {
  getIncomingBookings,
  getProviderActiveBookings,
  getApiErrorMessage,
} from '../services/api';
import type { IncomingBookingRequest } from '../types/booking';
import type { ProviderBookingItem } from '../types/providerBooking';
import { computeEarningsFromBookings } from '../data/providerBookingsMock';
import { mapIncomingListToProviderBookings } from '../utils/providerBookings';
import type { EarningsLineItem, EarningsSummary } from '../types/providerBooking';

const EMPTY_EARNINGS: EarningsSummary = {
  periodLabel: 'This month',
  grossTotal: 0,
  currency: 'GHS',
  platformFees: 0,
  netPayout: 0,
  sessionCount: 0,
};

export interface ProviderTabData {
  hostPending: IncomingBookingRequest[];
  hostActiveBookings: ProviderBookingItem[];
  hostEarningsSummary: EarningsSummary;
  hostEarningsLineItems: EarningsLineItem[];
  guidePending: IncomingBookingRequest[];
  guideActiveBookings: ProviderBookingItem[];
  earningsSummary: EarningsSummary;
  earningsLineItems: EarningsLineItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProviderTabData(
  userId: string | undefined,
  options: {
    fetchHostPending?: boolean;
    fetchHostActive?: boolean;
    fetchGuidePending?: boolean;
    fetchGuideActive?: boolean;
  },
): ProviderTabData {
  const [hostPending, setHostPending] = useState<IncomingBookingRequest[]>([]);
  const [hostActiveBookings, setHostActiveBookings] = useState<ProviderBookingItem[]>([]);
  const [hostEarningsSummary, setHostEarningsSummary] = useState<EarningsSummary>(EMPTY_EARNINGS);
  const [hostEarningsLineItems, setHostEarningsLineItems] = useState<EarningsLineItem[]>([]);
  const [guidePending, setGuidePending] = useState<IncomingBookingRequest[]>([]);
  const [guideActiveBookings, setGuideActiveBookings] = useState<ProviderBookingItem[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>(EMPTY_EARNINGS);
  const [earningsLineItems, setEarningsLineItems] = useState<EarningsLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!userId) {
      setHostPending([]);
      setHostActiveBookings([]);
      setHostEarningsSummary(EMPTY_EARNINGS);
      setHostEarningsLineItems([]);
      setGuidePending([]);
      setGuideActiveBookings([]);
      setEarningsSummary(EMPTY_EARNINGS);
      setEarningsLineItems([]);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      const errors: string[] = [];

      try {
        const tasks: Promise<void>[] = [];

        if (options.fetchHostPending) {
          tasks.push(
            getIncomingBookings('HOST', 'PENDING_HOST').then((items) => {
              if (!cancelled) setHostPending(items);
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setHostPending([]);
              }
            }),
          );
        }

        if (options.fetchHostActive) {
          tasks.push(
            getProviderActiveBookings('HOST').then((items) => {
              if (!cancelled) {
                const mapped = mapIncomingListToProviderBookings(items);
                setHostActiveBookings(mapped);
                const earnings = computeEarningsFromBookings(mapped, 'This month');
                setHostEarningsSummary(mapped.length > 0 ? earnings.summary : EMPTY_EARNINGS);
                setHostEarningsLineItems(mapped.length > 0 ? earnings.lineItems : []);
              }
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setHostActiveBookings([]);
                setHostEarningsSummary(EMPTY_EARNINGS);
                setHostEarningsLineItems([]);
              }
            }),
          );
        }

        if (options.fetchGuidePending) {
          tasks.push(
            getIncomingBookings('GUIDE', 'PENDING_HOST').then((items) => {
              if (!cancelled) setGuidePending(items);
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setGuidePending([]);
              }
            }),
          );
        }

        if (options.fetchGuideActive) {
          tasks.push(
            getProviderActiveBookings('GUIDE').then((items) => {
              if (!cancelled) {
                const mapped = mapIncomingListToProviderBookings(items);
                setGuideActiveBookings(mapped);
                const earnings = computeEarningsFromBookings(mapped, 'This month');
                setEarningsSummary(mapped.length > 0 ? earnings.summary : EMPTY_EARNINGS);
                setEarningsLineItems(mapped.length > 0 ? earnings.lineItems : []);
              }
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setGuideActiveBookings([]);
                setEarningsSummary(EMPTY_EARNINGS);
                setEarningsLineItems([]);
              }
            }),
          );
        }

        await Promise.all(tasks);

        if (!cancelled && errors.length > 0) {
          setError(errors[0]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    tick,
    options.fetchHostPending,
    options.fetchHostActive,
    options.fetchGuidePending,
    options.fetchGuideActive,
  ]);

  return {
    hostPending,
    hostActiveBookings,
    hostEarningsSummary,
    hostEarningsLineItems,
    guidePending,
    guideActiveBookings,
    earningsSummary,
    earningsLineItems,
    isLoading,
    error,
    refresh,
  };
}

import React, { useEffect, useState } from 'react';
import BookingScreen from '../screens/student/BookingScreen';
import SessionBookingScreen from '../screens/shared/SessionBookingScreen';
import RouteErrorState from '../components/RouteErrorState';
import {
  getHostProfile,
  getGuideProfile,
  getApiErrorMessage,
} from '../services/api';
import type {
  BookingContext,
  GuideProfileSummary,
  HostProfileSummary,
  PriceBreakdown,
} from '../types/booking';
import { computePriceBreakdown } from '../data/bookingMock';
import { computeSessionPrice } from '../data/guideSessionMock';

export interface BookingHostRouteProps {
  hostId: string;
  resolveHost: (hostId: string) => HostProfileSummary | null;
  showMatchScores: boolean;
  checkIn: string;
  checkOut: string;
  canBookHomestay: boolean;
  requestBlockedMessage: string;
  onContinueSetup: () => void;
  onBack: () => void;
  onSendRequest: (host: HostProfileSummary) => Promise<void>;
}

export function BookingHostRoute({
  hostId,
  resolveHost,
  showMatchScores,
  checkIn,
  checkOut,
  canBookHomestay,
  requestBlockedMessage,
  onContinueSetup,
  onBack,
  onSendRequest,
}: BookingHostRouteProps) {
  const [host, setHost] = useState<HostProfileSummary | null>(() => resolveHost(hostId));
  const [isLoading, setIsLoading] = useState(!host);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const cached = resolveHost(hostId);
    if (cached) {
      setHost(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await getHostProfile(hostId);
        if (!cancelled) {
          setHost(profile);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setHost(null);
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
  }, [hostId, resolveHost]);

  if (isLoading) {
    return <RouteErrorState isLoading message="" />;
  }

  if (error || !host) {
    return (
      <RouteErrorState
        title="Host not found"
        message={error ?? 'We could not load this host listing.'}
        onBack={onBack}
      />
    );
  }

  const priceBreakdown: PriceBreakdown = computePriceBreakdown(
    host.pricePerNight,
    host.currency,
    checkIn,
    checkOut,
  );

  return (
    <BookingScreen
      host={host}
      showMatchScores={showMatchScores}
      checkIn={checkIn}
      checkOut={checkOut}
      priceBreakdown={priceBreakdown}
      requestBlocked={!canBookHomestay}
      requestBlockedMessage={requestBlockedMessage}
      submitErrorMessage={submitError}
      onContinueSetup={onContinueSetup}
      onBack={onBack}
      onSendRequest={async () => {
        setSubmitError(null);
        try {
          await onSendRequest(host);
        } catch (err) {
          setSubmitError(getApiErrorMessage(err));
        }
      }}
    />
  );
}

export interface SessionBookingGuideRouteProps {
  guideId: string;
  resolveGuide: (guideId: string) => GuideProfileSummary | null;
  sessionDate: string;
  sessionStartTime: string;
  canBookGuideSession: boolean;
  requestBlockedMessage: string;
  onContinueSetup: () => void;
  onBack: () => void;
  onSendRequest: (guide: GuideProfileSummary) => Promise<void>;
}

export function SessionBookingGuideRoute({
  guideId,
  resolveGuide,
  sessionDate,
  sessionStartTime,
  canBookGuideSession,
  requestBlockedMessage,
  onContinueSetup,
  onBack,
  onSendRequest,
}: SessionBookingGuideRouteProps) {
  const [guide, setGuide] = useState<GuideProfileSummary | null>(() => resolveGuide(guideId));
  const [isLoading, setIsLoading] = useState(!guide);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const cached = resolveGuide(guideId);
    if (cached) {
      setGuide(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await getGuideProfile(guideId);
        if (!cancelled) {
          setGuide(profile);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setGuide(null);
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
  }, [guideId, resolveGuide]);

  if (isLoading) {
    return <RouteErrorState isLoading message="" />;
  }

  if (error || !guide) {
    return (
      <RouteErrorState
        title="Guide not found"
        message={error ?? 'We could not load this guide profile.'}
        onBack={onBack}
      />
    );
  }

  const sessionPrice = computeSessionPrice(guide.pricePerSession, guide.currency);

  return (
    <SessionBookingScreen
      guide={guide}
      sessionDate={sessionDate}
      sessionStartTime={sessionStartTime}
      sessionPrice={sessionPrice}
      requestBlocked={!canBookGuideSession}
      requestBlockedMessage={requestBlockedMessage}
      submitErrorMessage={submitError}
      onContinueSetup={onContinueSetup}
      onBack={onBack}
      onSendRequest={async () => {
        setSubmitError(null);
        try {
          await onSendRequest(guide);
        } catch (err) {
          setSubmitError(getApiErrorMessage(err));
        }
      }}
    />
  );
}

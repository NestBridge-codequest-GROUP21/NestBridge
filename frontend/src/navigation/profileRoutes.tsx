import React, { useEffect, useState } from 'react';
import HostProfileScreen from '../screens/student/HostProfileScreen';
import GuideProfileDetailScreen from '../screens/shared/GuideProfileDetailScreen';
import RouteErrorState from '../components/RouteErrorState';
import {
  getHostProfile,
  getGuideProfile,
  getApiErrorMessage,
} from '../services/api';
import type { GuideProfileSummary, HostProfileSummary } from '../types/booking';

export interface HostProfileRouteProps {
  hostId: string;
  showMatchScores: boolean;
  resolveHost: (hostId: string) => HostProfileSummary | null;
  canBookHomestay: boolean;
  onContinueSetup: () => void;
  onBack: () => void;
  onBookPress: (host: HostProfileSummary) => void;
  onMessagePress: (host: HostProfileSummary) => void;
}

export function HostProfileRoute({
  hostId,
  showMatchScores,
  resolveHost,
  canBookHomestay,
  onContinueSetup,
  onBack,
  onBookPress,
  onMessagePress,
}: HostProfileRouteProps) {
  const [host, setHost] = useState<HostProfileSummary | null>(() => resolveHost(hostId));
  const [isLoading, setIsLoading] = useState(!host);
  const [error, setError] = useState<string | null>(null);

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
        if (!cancelled) setHost(profile);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setHost(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
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
        message={error ?? 'Could not load this host profile. Check your connection and try again.'}
        onBack={onBack}
      />
    );
  }

  return (
    <HostProfileScreen
      host={host}
      showMatchScores={showMatchScores}
      about={`A welcoming host home in ${host.location}. Quiet study space, home-cooked meals when arranged, and an easy commute to campus and city amenities.`}
      highlights={['Meals available', 'Study-friendly', 'Near campus']}
      setupIncomplete={!canBookHomestay}
      setupMessage={
        'Complete your travel profile to message this host and request a stay.'
      }
      onContinueSetup={onContinueSetup}
      onBack={onBack}
      onBookPress={() => {
        if (!canBookHomestay) {
          onContinueSetup();
          return;
        }
        onBookPress(host);
      }}
      onMessagePress={() => {
        if (!canBookHomestay) {
          onContinueSetup();
          return;
        }
        onMessagePress(host);
      }}
    />
  );
}

export interface GuideProfileRouteProps {
  guideId: string;
  showMatchScores: boolean;
  resolveGuide: (guideId: string) => GuideProfileSummary | null;
  canBookGuideSession: boolean;
  onContinueSetup: () => void;
  onBack: () => void;
  onBookPress: (guide: GuideProfileSummary) => void;
  onMessagePress: (guide: GuideProfileSummary) => void;
}

export function GuideProfileRoute({
  guideId,
  showMatchScores,
  resolveGuide,
  canBookGuideSession,
  onContinueSetup,
  onBack,
  onBookPress,
  onMessagePress,
}: GuideProfileRouteProps) {
  const [guide, setGuide] = useState<GuideProfileSummary | null>(() => resolveGuide(guideId));
  const [isLoading, setIsLoading] = useState(!guide);
  const [error, setError] = useState<string | null>(null);

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
        if (!cancelled) setGuide(profile);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setGuide(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
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
        message={error ?? 'Could not load guide profile.'}
        onBack={onBack}
      />
    );
  }

  return (
    <GuideProfileDetailScreen
      guide={guide}
      showMatchScores={showMatchScores}
      setupIncomplete={!canBookGuideSession}
      setupMessage="Complete your travel profile to message this guide and book a session."
      onContinueSetup={onContinueSetup}
      onBack={onBack}
      onBookPress={() => {
        if (!canBookGuideSession) {
          onContinueSetup();
          return;
        }
        onBookPress(guide);
      }}
      onMessagePress={() => {
        if (!canBookGuideSession) {
          onContinueSetup();
          return;
        }
        onMessagePress(guide);
      }}
    />
  );
}

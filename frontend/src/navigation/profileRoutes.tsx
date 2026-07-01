import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import HostProfileScreen from '../screens/student/HostProfileScreen';
import GuideProfileDetailScreen from '../screens/shared/GuideProfileDetailScreen';
import {
  getHostProfile,
  getGuideProfile,
  getApiErrorMessage,
} from '../services/api';
import type { GuideProfileSummary, HostProfileSummary } from '../types/booking';
import { colors, spacing, fontFamilies, fontSizes } from '../constants/theme';

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
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  if (error || !host) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error ?? 'Could not load host profile.'}</Text>
      </View>
    );
  }

  return (
    <HostProfileScreen
      host={host}
      showMatchScores={showMatchScores}
      onBack={onBack}
      onBookPress={() => {
        if (!canBookHomestay) {
          onContinueSetup();
          return;
        }
        onBookPress(host);
      }}
      onMessagePress={() => onMessagePress(host)}
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
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  if (error || !guide) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error ?? 'Could not load guide profile.'}</Text>
      </View>
    );
  }

  return (
    <GuideProfileDetailScreen
      guide={guide}
      showMatchScores={showMatchScores}
      onBack={onBack}
      onBookPress={() => {
        if (!canBookGuideSession) {
          onContinueSetup();
          return;
        }
        onBookPress(guide);
      }}
      onMessagePress={() => onMessagePress(guide)}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

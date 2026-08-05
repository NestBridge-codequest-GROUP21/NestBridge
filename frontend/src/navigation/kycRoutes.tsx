import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, View, StyleSheet } from 'react-native';
import KYCPromptScreen from '../screens/host/KYCPromptScreen';
import VerificationStatusScreen, {
  type VerificationUiStatus,
} from '../screens/shared/VerificationStatusScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';
import { kycPromptForTrack } from '../data/kycPromptMock';
import { pickKycDocumentImage, type PickedImage } from '../services/imagePicker';
import {
  createKycSession,
  getApiErrorMessage,
  getKycStatus,
} from '../services/api';
import { appAlert } from '../utils/appAlert';
import { spacing } from '../constants/theme';

function normalizeVerificationStatus(raw: string | undefined | null): VerificationUiStatus {
  const value = (raw ?? 'none').toLowerCase();
  if (value === 'pending' || value === 'approved' || value === 'rejected' || value === 'none') {
    return value;
  }
  return 'none';
}

export interface KycPromptRouteProps {
  track: 'SEEKER' | 'HOST' | 'GUIDE';
  onFinished: () => void;
  /** When the member already has a review in flight or is verified — open status instead of a new submit. */
  onShowStatus?: () => void;
}

export function KycPromptRoute({ track, onFinished, onShowStatus }: KycPromptRouteProps) {
  const { refreshSession } = useAuth();
  const { colors } = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [gateLoading, setGateLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PickedImage | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    void (async () => {
      try {
        const refreshed = await refreshSession();
        if (refreshed?.identityVerified) {
          appAlert(
            "You're verified",
            'NestBridge staff already approved your identity. Core actions are unlocked.',
          );
          if (onShowStatus) {
            onShowStatus();
          } else {
            onFinished();
          }
          return;
        }
        const result = await getKycStatus();
        const status = normalizeVerificationStatus(result.status);
        if (status === 'pending') {
          appAlert(
            'Verification under review',
            'You already submitted for staff review. NestBridge will notify you when they accept or decline — check status anytime from Profile.',
          );
          if (onShowStatus) {
            onShowStatus();
          } else {
            onFinished();
          }
          return;
        }
        if (status === 'approved') {
          appAlert(
            "You're verified",
            'NestBridge staff already approved your identity. Core actions are unlocked.',
          );
          if (onShowStatus) {
            onShowStatus();
          } else {
            onFinished();
          }
          return;
        }
        // rejected or none → stay on prompt so they can (re)submit once.
      } catch (error) {
        appAlert('Connection issue', getApiErrorMessage(error));
      } finally {
        setGateLoading(false);
      }
    })();
  }, [onFinished, onShowStatus, refreshSession]);

  if (gateLoading) {
    return (
      <View style={[styles.gate, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  return (
    <KYCPromptScreen
      data={kycPromptForTrack(track)}
      submitting={submitting}
      selectedPhotoUri={selectedPhoto?.uri ?? null}
      onPickPhoto={() => {
        void (async () => {
          if (submitting) return;
          const picked = await pickKycDocumentImage();
          if (picked) {
            setSelectedPhoto(picked);
          }
        })();
      }}
      onClearPhoto={() => {
        if (submitting) return;
        setSelectedPhoto(null);
        void (async () => {
          const picked = await pickKycDocumentImage();
          if (picked) {
            setSelectedPhoto(picked);
          }
        })();
      }}
      onVerifyNow={() => {
        void (async () => {
          if (submitting) return;
          if (!selectedPhoto?.uri) {
            appAlert(
              'Photo required',
              'Upload a clear photo of your face or ID so NestBridge staff can verify you.',
            );
            return;
          }
          setSubmitting(true);
          try {
            // Re-check so a second tap cannot create another review.
            const latest = await getKycStatus();
            const status = normalizeVerificationStatus(latest.status);
            if (status === 'pending' || status === 'approved') {
              appAlert(
                status === 'pending' ? 'Verification under review' : "You're verified",
                status === 'pending'
                  ? 'You already have a review in progress. Check Verification status in Profile.'
                  : 'NestBridge staff already approved your identity.',
              );
              if (onShowStatus) {
                onShowStatus();
              } else {
                onFinished();
              }
              return;
            }
            const session = await createKycSession({
              uri: selectedPhoto.uri,
              mimeType: selectedPhoto.mimeType,
            });
            if (session.verificationUrl) {
              await Linking.openURL(session.verificationUrl);
            } else {
              appAlert(
                session.enabled ? 'Verification' : 'Submitted for staff review',
                session.message
                  ?? 'Your photo is with NestBridge staff. You can keep browsing until they approve you.',
              );
            }
            if (onShowStatus) {
              onShowStatus();
            } else {
              onFinished();
            }
          } catch (error) {
            appAlert('Could not submit verification', getApiErrorMessage(error));
          } finally {
            setSubmitting(false);
          }
        })();
      }}
      onVerifyLater={() => {
        if (submitting) return;
        appAlert(
          'Browse for now',
          'You can explore NestBridge, but booking, paying, messaging, and accepting requests stay locked until staff verifies you.',
        );
        onFinished();
      }}
    />
  );
}

export interface VerificationStatusRouteProps {
  onBack: () => void;
  onVerifyNow: () => void;
}

export function VerificationStatusRoute({
  onBack,
  onVerifyNow,
}: VerificationStatusRouteProps) {
  const { refreshSession } = useAuth();
  const [status, setStatus] = useState<VerificationUiStatus>('none');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        await refreshSession();
        const result = await getKycStatus();
        setStatus(normalizeVerificationStatus(result.status));
        setRejectionReason(result.rejectionReason ?? null);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [refreshSession],
  );

  useEffect(() => {
    void loadStatus('initial');
  }, [loadStatus]);

  return (
    <VerificationStatusScreen
      status={status}
      rejectionReason={rejectionReason}
      loading={loading}
      refreshing={refreshing}
      error={error}
      onBack={onBack}
      onVerifyNow={
        status === 'pending' || status === 'approved'
          ? undefined
          : onVerifyNow
      }
      onRefresh={() => {
        void loadStatus('refresh');
      }}
      onRetry={() => {
        void loadStatus('initial');
      }}
    />
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});

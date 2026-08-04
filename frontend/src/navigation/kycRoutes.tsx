import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import KYCPromptScreen from '../screens/host/KYCPromptScreen';
import VerificationStatusScreen, {
  type VerificationUiStatus,
} from '../screens/shared/VerificationStatusScreen';
import { useAuth } from '../context/AuthContext';
import { kycPromptForTrack } from '../data/kycPromptMock';
import { pickKycDocumentImage, type PickedImage } from '../services/imagePicker';
import {
  createKycSession,
  getApiErrorMessage,
  getKycStatus,
} from '../services/api';

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
}

export function KycPromptRoute({ track, onFinished }: KycPromptRouteProps) {
  const { refreshSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PickedImage | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    void (async () => {
      try {
        const refreshed = await refreshSession();
        if (refreshed?.identityVerified) {
          Alert.alert(
            "You're verified",
            'NestBridge staff already approved your identity. Core actions are unlocked.',
          );
          onFinished();
        }
      } catch (error) {
        Alert.alert('Connection issue', getApiErrorMessage(error));
      }
    })();
  }, [onFinished, refreshSession]);

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
            Alert.alert(
              'Photo required',
              'Upload a clear photo of your face or ID so NestBridge staff can verify you.',
            );
            return;
          }
          setSubmitting(true);
          try {
            const session = await createKycSession({
              uri: selectedPhoto.uri,
              mimeType: selectedPhoto.mimeType,
            });
            if (session.verificationUrl) {
              await Linking.openURL(session.verificationUrl);
            } else {
              Alert.alert(
                session.enabled ? 'Verification' : 'Submitted for staff review',
                session.message
                  ?? 'Your photo is with NestBridge staff. You can keep browsing until they approve you.',
              );
            }
            onFinished();
          } catch (error) {
            Alert.alert('Could not submit verification', getApiErrorMessage(error));
          } finally {
            setSubmitting(false);
          }
        })();
      }}
      onVerifyLater={() => {
        if (submitting) return;
        Alert.alert(
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
      onVerifyNow={onVerifyNow}
      onRefresh={() => {
        void loadStatus('refresh');
      }}
      onRetry={() => {
        void loadStatus('initial');
      }}
    />
  );
}

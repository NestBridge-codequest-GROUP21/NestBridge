import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import KYCPromptScreen from '../screens/host/KYCPromptScreen';
import VerificationStatusScreen, {
  type VerificationUiStatus,
} from '../screens/shared/VerificationStatusScreen';
import { kycPromptForTrack } from '../data/kycPromptMock';
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
  const [submitting, setSubmitting] = useState(false);

  return (
    <KYCPromptScreen
      data={kycPromptForTrack(track)}
      submitting={submitting}
      onVerifyNow={() => {
        void (async () => {
          if (submitting) return;
          setSubmitting(true);
          try {
            const session = await createKycSession();
            if (session.verificationUrl) {
              await Linking.openURL(session.verificationUrl);
            } else {
              Alert.alert(
                session.enabled ? 'Verification' : 'Verification pending',
                session.message
                  ?? 'Submitted for NestBridge staff review. You can browse now — book, pay, and chat unlock after approval.',
              );
            }
          } catch (error) {
            Alert.alert('Verification', getApiErrorMessage(error));
          } finally {
            setSubmitting(false);
          }
          // Signup path always finishes onboarding; mid-app KYC also lands here safely.
          onFinished();
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
  const [status, setStatus] = useState<VerificationUiStatus>('none');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getKycStatus();
      setStatus(normalizeVerificationStatus(result.status));
      setRejectionReason(result.rejectionReason ?? null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  return (
    <VerificationStatusScreen
      status={status}
      rejectionReason={rejectionReason}
      loading={loading}
      error={error}
      onBack={onBack}
      onVerifyNow={onVerifyNow}
      onRetry={() => {
        void loadStatus();
      }}
    />
  );
}

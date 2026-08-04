export type KycPromptTrack = 'HOST' | 'GUIDE' | 'SEEKER';

export interface KYCPromptData {
  roleLabel: string;
  message: string;
  explanation: string;
  note: string;
}

export const HOST_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'Host Family',
  message: 'Identity check required before you go live.',
  explanation:
    'Upload a clear photo of your face or government ID. NestBridge staff use it with your profile (name, bio, and about) to verify you.',
  note:
    'After staff approves you, pull down on Verification status (or reopen the app) if booking still looks locked. You can keep browsing meanwhile.',
};

export const GUIDE_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'Local Guide',
  message: 'Identity check required before you go live.',
  explanation:
    'Upload a clear photo of your face or government ID. NestBridge staff use it with your profile (name, bio, and about) to verify you.',
  note:
    'After staff approves you, pull down on Verification status (or reopen the app) if sessions still look locked. You can keep browsing meanwhile.',
};

export const SEEKER_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'NestBridge member',
  message: 'Verify now, or skip and browse.',
  explanation:
    'Upload a clear photo of your face or ID so NestBridge staff can approve your identity before you book, pay, or chat.',
  note:
    'Until staff approves you, explore stays open. After approval, pull down on Verification status if core actions still look locked.',
};

export function kycPromptForTrack(track: KycPromptTrack): KYCPromptData {
  if (track === 'HOST') return HOST_KYC_PROMPT;
  if (track === 'GUIDE') return GUIDE_KYC_PROMPT;
  return SEEKER_KYC_PROMPT;
}

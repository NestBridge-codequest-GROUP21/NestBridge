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
    'NestBridge staff must verify your identity before you can accept stays or earn. Browse and finish your listing anytime.',
  note:
    'Tap Verify now to submit for staff review. You can keep browsing until you are approved.',
};

export const GUIDE_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'Local Guide',
  message: 'Identity check required before you go live.',
  explanation:
    'NestBridge staff must verify your identity before you can accept sessions or earn. Browse and finish your listing anytime.',
  note:
    'Tap Verify now to submit for staff review. You can keep browsing until you are approved.',
};

export const SEEKER_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'NestBridge member',
  message: 'Verify now, or skip and browse.',
  explanation:
    'Everyone goes through identity verification. NestBridge staff approve accounts before you can book, pay, or chat. You can submit now or keep browsing and verify later.',
  note:
    'Until staff approves you, explore stays open — booking, paying, and messaging stay locked.',
};

export function kycPromptForTrack(track: KycPromptTrack): KYCPromptData {
  if (track === 'HOST') return HOST_KYC_PROMPT;
  if (track === 'GUIDE') return GUIDE_KYC_PROMPT;
  return SEEKER_KYC_PROMPT;
}

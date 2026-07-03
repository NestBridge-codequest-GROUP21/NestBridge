export interface KYCPromptData {
  roleLabel: string;
  message: string;
  explanation: string;
  note: string;
}

export const HOST_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'Host Family',
  message: 'One last step to go live.',
  explanation:
    'Verification helps students trust that you are a safe and reliable host. It only takes a few minutes.',
  note:
    'Complete verification to earn a trust badge on your listing. You can go live now and verify later.',
};

export const GUIDE_KYC_PROMPT: KYCPromptData = {
  roleLabel: 'Local Guide',
  message: 'One last step to go live.',
  explanation:
    'Verification helps travellers trust your profile and book sessions with confidence.',
  note:
    'Complete verification to earn a trust badge on your profile. You can go live now and verify later.',
};

export function kycPromptForTrack(track: 'HOST' | 'GUIDE'): KYCPromptData {
  return track === 'HOST' ? HOST_KYC_PROMPT : GUIDE_KYC_PROMPT;
}

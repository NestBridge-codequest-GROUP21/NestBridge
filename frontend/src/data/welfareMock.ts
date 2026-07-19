export interface WelfareCheckInQuestion {
  id: string;
  prompt: string;
}

export const welfareCheckInQuestions: WelfareCheckInQuestion[] = [
  {
    id: 'safe',
    prompt: 'Do you feel safe in your current accommodation?',
  },
  {
    id: 'needs',
    prompt: 'Are your basic needs (food, water, transport) being met?',
  },
  {
    id: 'support',
    prompt: 'Do you know who to contact if you need help tonight?',
  },
];

export const welfareCheckInIntro =
  'NestBridge checks in during your stay to make sure you are safe and supported. Your answers are private and only used for welfare follow-up.';

export const reviewPromptCopy = {
  title: 'How was your stay?',
  subtitle:
    'Reviews are sealed until both you and your host complete feedback — this keeps ratings fair.',
  ratingLabel: 'Overall experience',
  commentPlaceholder: 'Share what went well or what could improve (optional)',
  submitLabel: 'Submit review',
  skipLabel: 'Skip for now',
};

import type { PrimaryIntent } from '../types/accountProfile';

/** Remote hero photos — role-themed lifestyle imagery for onboarding completion. */
export const ONBOARDING_HERO_IMAGES: Record<PrimaryIntent, string> = {
  TOURIST:
    'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=80',
  HOST:
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
  GUIDE:
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=80',
  STUDENT:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
};

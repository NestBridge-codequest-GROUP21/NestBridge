import type { PrimaryIntent } from '../types/accountProfile';

/** Local hero photos — role-themed lifestyle imagery for onboarding completion. */
export const ONBOARDING_HERO_IMAGES: Record<PrimaryIntent, ReturnType<typeof require>> = {
  TOURIST: require('../../assets/onboarding/tourist.jpeg'),
  HOST: require('../../assets/onboarding/host.jpeg'),
  GUIDE: require('../../assets/onboarding/guide.jpeg'),
  STUDENT: require('../../assets/onboarding/student.jpeg'),
};
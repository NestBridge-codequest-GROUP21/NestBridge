import type { EmergencyContact } from '../screens/shared/SOSScreen';

/**
 * Unique Ghana emergency + NestBridge support contacts.
 * National emergency (112) is the SOS primary CTA — not repeated in this list.
 */
export const emergencyContactsMock: EmergencyContact[] = [
  {
    label: 'Ghana Police',
    number: '191',
  },
  {
    label: 'Ghana National Ambulance',
    number: '193',
  },
  {
    label: 'Ghana Fire Service',
    number: '192',
  },
  {
    label: 'NestBridge 24/7 support',
    number: '+233 59 556 2101',
  },
];

/** Ghana national emergency line — used by the SOS primary CTA. */
export const localEmergencyNumber = '112';

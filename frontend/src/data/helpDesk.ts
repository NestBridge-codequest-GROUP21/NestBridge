import type { EmergencyContact } from '../screens/shared/SOSScreen';
import { emergencyContactsMock } from './sosMock';

export type HelpTopic = {
  id: string;
  title: string;
  body: string;
};

/** Non-emergency guidance for users stuck in the app. */
export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'account',
    title: 'Sign in, verify email, or reset password',
    body:
      'Use Forgot password on the login screen. Check spam for verification or reset emails. If create account says the email is taken, that address is already registered — sign in or reset the password.',
  },
  {
    id: 'booking',
    title: 'Booking request stuck or not accepted',
    body:
      'Hosts and guides must accept before you can pay. Open Bookings to see status. Message the provider from Messages if you need a quicker reply.',
  },
  {
    id: 'payment',
    title: 'Payment or Paystack not completing',
    body:
      'Finish checkout in Paystack, then return to NestBridge. Pull to refresh Bookings. If you were charged but status is still Accepted, wait a minute and refresh again, or contact NestBridge support below.',
  },
  {
    id: 'kyc',
    title: 'Identity verification pending',
    body:
      'Verify now queues a manual review when automated KYC is unavailable. You can keep using the app with Verify later. Staff will force-verify after review — contact support if it has been longer than a day.',
  },
  {
    id: 'chat',
    title: 'Messages not showing',
    body:
      'Keep the chat screen open and wait a moment for live sync. Leave and reopen the conversation if needed. Both people must be signed in on NestBridge.',
  },
];

/** NestBridge team lines only — emergencies stay on the SOS screen. */
export function nestBridgeSupportContacts(): EmergencyContact[] {
  return emergencyContactsMock.filter(
    (contact) =>
      contact.organisation.toLowerCase().includes('nestbridge') &&
      Boolean(contact.contactName),
  );
}

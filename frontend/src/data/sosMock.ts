import type { EmergencyContact } from '../screens/shared/SOSScreen';

/**
 * Unique Ghana emergency + NestBridge support contacts.
 * National emergency (112) is the SOS primary CTA — not repeated in this list.
 * Organisation / department / title only — no invented personal names.
 */
export const emergencyContactsMock: EmergencyContact[] = [
  {
    organisation: 'Ghana Police Service',
    department: 'Emergency Dispatch',
    contactTitle: 'Emergency Dispatch',
    number: '191',
    description: 'Police emergency response across Ghana',
  },
  {
    organisation: 'National Ambulance Service',
    department: 'Emergency Dispatch',
    contactTitle: 'Emergency Dispatch',
    number: '193',
    description: 'Medical emergency and ambulance dispatch',
  },
  {
    organisation: 'Ghana National Fire Service',
    department: 'Emergency Dispatch',
    contactTitle: 'Emergency Dispatch',
    number: '192',
    description: 'Fire, rescue, and related emergencies',
  },
  {
    organisation: 'University Security Services',
    department: 'Security Control Room',
    contactTitle: 'Security Control Room',
    number: '+233 30 250 0000',
    description: 'Campus security for students and visitors',
  },
  {
    organisation: 'University Health Services',
    department: 'Emergency Desk',
    contactTitle: 'Emergency Desk',
    number: '+233 30 250 0001',
    description: 'Campus clinic emergency desk',
  },
  {
    organisation: 'NestBridge Support',
    department: '24/7 Support Desk',
    contactTitle: 'Support Desk',
    number: '+233 59 556 2101',
    description: 'Platform support for NestBridge travellers and hosts',
  },
];

/** Ghana national emergency line — used by the SOS primary CTA. */
export const localEmergencyNumber = '112';

/** Enrich thin API contacts (label + number) with known Ghana context. */
export function enrichEmergencyContact(contact: {
  label?: string;
  organisation?: string;
  department?: string;
  contactTitle?: string;
  number: string;
  description?: string;
  contactName?: string;
  isUserContact?: boolean;
}): EmergencyContact {
  const number = contact.number.trim();
  const digits = number.replace(/[^\d]/g, '');
  const known = emergencyContactsMock.find(
    (entry) => entry.number.replace(/[^\d]/g, '') === digits,
  );

  if (contact.isUserContact || contact.contactName) {
    return {
      organisation: contact.organisation ?? contact.label ?? 'Personal contact',
      department: contact.department,
      contactTitle: contact.contactTitle,
      number,
      description: contact.description,
      contactName: contact.contactName ?? contact.label,
      isUserContact: true,
    };
  }

  if (known) {
    return {
      ...known,
      number,
      description: contact.description ?? known.description,
    };
  }

  return {
    organisation:
      contact.organisation?.trim() ||
      contact.label?.trim() ||
      'Emergency contact',
    department: contact.department,
    contactTitle: contact.contactTitle ?? contact.department,
    number,
    description: contact.description,
  };
}

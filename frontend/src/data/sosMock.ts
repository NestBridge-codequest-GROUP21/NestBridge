import type { EmergencyContact } from '../screens/shared/SOSScreen';

/**
 * Unique Ghana emergency + NestBridge support contacts.
 * National emergency (112) is the SOS primary CTA — not repeated in this list.
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
    contactName: 'Blessing Baffoa Hackman',
    contactTitle: 'Platform support',
    number: '+233 59 556 2101',
    description: 'NestBridge team contact for travellers, hosts, and guides',
  },
  {
    organisation: 'NestBridge Support',
    contactName: 'Taslimah Abdul Samed',
    contactTitle: 'Platform support',
    number: '+233 24 300 8368',
    description: 'NestBridge team contact for travellers, hosts, and guides',
  },
  {
    organisation: 'NestBridge Support',
    contactName: 'Sirina Safianu Abbas',
    contactTitle: 'Platform support',
    number: '+233 59 661 4273',
    description: 'NestBridge team contact for travellers, hosts, and guides',
  },
  {
    organisation: 'NestBridge Support',
    contactName: 'Abigail Adusei',
    contactTitle: 'Platform support',
    number: '+233 20 553 7622',
    description: 'NestBridge team contact for travellers, hosts, and guides',
  },
  {
    organisation: 'NestBridge Support',
    contactName: 'Angel Onwe',
    contactTitle: 'Platform support',
    number: '+233 20 334 6248',
    description: 'NestBridge team contact for travellers, hosts, and guides',
  },
];

/** Ghana national emergency line — used by the SOS primary CTA. */
export const localEmergencyNumber = '112';

function digitsOnly(value: string): string {
  let digits = value.replace(/[^\d]/g, '');
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = `233${digits.slice(1)}`;
  }
  return digits;
}

/** Parse "Name — NestBridge Support" even when the dash was mangled in transit. */
function parseNestBridgeOwnerLabel(
  label: string,
): { contactName: string; organisation: string } | null {
  const cleaned = label.replace(/\uFFFD/g, '—').trim();
  const match = cleaned.match(
    /^(.+?)\s*[—–\-\uFFFD]+\s*(NestBridge\b.*)$/i,
  );
  if (!match) {
    return null;
  }
  const contactName = match[1].trim();
  const organisation = match[2].trim() || 'NestBridge Support';
  if (!contactName) {
    return null;
  }
  return { contactName, organisation };
}

/** Enrich thin API contacts (label + number) with known Ghana / NestBridge context. */
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
  const digits = digitsOnly(number);
  const known = emergencyContactsMock.find(
    (entry) => digitsOnly(entry.number) === digits,
  );

  if (contact.isUserContact || (contact.contactName && !known)) {
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

  // Prefer the known NestBridge / Ghana catalog row for this phone number.
  if (known) {
    return {
      ...known,
      number,
      description: contact.description ?? known.description,
    };
  }

  const label = contact.label?.trim() ?? '';
  const parsed = parseNestBridgeOwnerLabel(label);
  if (parsed) {
    return {
      organisation: parsed.organisation,
      contactName: parsed.contactName,
      contactTitle: 'Platform support',
      number,
      description:
        contact.description ??
        'NestBridge team contact for travellers, hosts, and guides',
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

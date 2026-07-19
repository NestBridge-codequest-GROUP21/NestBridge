export type StudentEventType = 'PARTY' | 'TRIP' | 'MEETUP' | 'CULTURAL' | 'FOOD';

export type StudentEventOrganizerKind = 'FAMILY' | 'ORG' | 'STUDENT';

export interface StudentEvent {
  id: string;
  title: string;
  type: StudentEventType;
  organizerKind: StudentEventOrganizerKind;
  organizerName: string;
  organizerInitials: string;
  dateLabel: string;
  location: string;
  description: string;
  capacity: number;
  attending: number;
  hostedByYou?: boolean;
}

export interface StudentEventDraft {
  title: string;
  type: StudentEventType;
  organizerKind: StudentEventOrganizerKind;
  dateLabel: string;
  location: string;
  capacity: string;
  description: string;
}

export const EVENT_TYPE_META: Record<
  StudentEventType,
  { label: string; icon: string }
> = {
  PARTY: { label: 'Party', icon: '🎉' },
  TRIP: { label: 'Trip', icon: '🚌' },
  MEETUP: { label: 'Meetup', icon: '🤝' },
  CULTURAL: { label: 'Cultural', icon: '🥁' },
  FOOD: { label: 'Food', icon: '🍲' },
};

export const EVENT_TYPE_ORDER: StudentEventType[] = [
  'MEETUP',
  'PARTY',
  'TRIP',
  'CULTURAL',
  'FOOD',
];

export const EVENT_ORGANIZER_META: Record<
  StudentEventOrganizerKind,
  { label: string }
> = {
  FAMILY: { label: 'Host family' },
  ORG: { label: 'Exchange org' },
  STUDENT: { label: 'Student' },
};

export const EVENT_ORGANIZER_ORDER: StudentEventOrganizerKind[] = [
  'STUDENT',
  'FAMILY',
  'ORG',
];

export const studentEventsMock: StudentEvent[] = [
  {
    id: 'evt-1',
    title: 'Welcome dinner at the Mensah home',
    type: 'FOOD',
    organizerKind: 'FAMILY',
    organizerName: 'Abena Mensah',
    organizerInitials: 'AM',
    dateLabel: 'Sat, Jul 18 · 5:00 PM',
    location: 'East Legon, Accra',
    description:
      'Home-cooked Ghanaian dinner for new exchange students. Come hungry and meet other families.',
    capacity: 12,
    attending: 7,
  },
  {
    id: 'evt-2',
    title: 'Weekend trip to Cape Coast Castle',
    type: 'TRIP',
    organizerKind: 'ORG',
    organizerName: 'ISEP Exchange Office',
    organizerInitials: 'IE',
    dateLabel: 'Sun, Jul 26 · 7:00 AM',
    location: 'Departs University of Ghana',
    description:
      'Guided day trip to Cape Coast and Kakum. Transport and entry included — opt in to reserve a seat.',
    capacity: 30,
    attending: 22,
  },
  {
    id: 'evt-3',
    title: 'Twi language & games night',
    type: 'MEETUP',
    organizerKind: 'STUDENT',
    organizerName: 'Priya Sharma',
    organizerInitials: 'PS',
    dateLabel: 'Fri, Jul 24 · 6:30 PM',
    location: 'Campus common room, Block C',
    description:
      'Casual practice night — learn market phrases, play games, and make friends. All levels welcome.',
    capacity: 20,
    attending: 9,
  },
  {
    id: 'evt-4',
    title: 'Independence Square photo walk',
    type: 'CULTURAL',
    organizerKind: 'STUDENT',
    organizerName: 'Marcus Lee',
    organizerInitials: 'ML',
    dateLabel: 'Sat, Aug 2 · 9:00 AM',
    location: 'Black Star Square, Accra',
    description:
      'Morning walk around the historic square. Bring a camera or just tag along for the views.',
    capacity: 15,
    attending: 4,
  },
];

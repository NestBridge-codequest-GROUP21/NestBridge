import type { ChatMessage, ConversationListItem } from '../types/messaging';
import { hostVerification, guideVerification } from '../types/verification';

export const conversationsMock: ConversationListItem[] = [
  {
    id: 'conv-1',
    participantId: 'host-1',
    participantName: 'Ama Mensah',
    participantInitials: 'AM',
    participantRole: 'host',
    profileTargetId: 'host-1',
    lastMessage: 'Your room is ready for your arrival',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unreadCount: 2,
    verification: hostVerification(),
    rating: 4.9,
    ratingCount: 28,
    bookingContext: {
      kind: 'HOST_STAY',
      title: 'Host stay',
      detailLabel: 'Dates',
      detailValue: 'Aug 20 – Sep 20, 2026',
      statusLabel: 'Accepted',
      statusTone: 'info',
      bookingId: 'booking-host-1',
    },
  },
  {
    id: 'conv-2',
    participantId: 'guide-1',
    participantName: 'Kofi Asante',
    participantInitials: 'KA',
    participantRole: 'guide',
    profileTargetId: 'guide-1',
    lastMessage: 'I can meet you at the castle entrance at 10am.',
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    verification: guideVerification(),
    rating: 4.8,
    ratingCount: 41,
    bookingContext: {
      kind: 'GUIDE_SESSION',
      title: 'Cape Coast Castle Tour',
      detailLabel: 'Date',
      detailValue: 'Tomorrow 10:00 AM',
      statusLabel: 'Confirmed',
      statusTone: 'success',
      bookingId: 'booking-guide-1',
    },
  },
  {
    id: 'conv-3',
    participantId: 'student-2',
    participantName: 'James Osei',
    participantInitials: 'JO',
    participantRole: 'guest',
    lastMessage: 'Thanks for reviewing my homestay request.',
    lastMessageAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    rating: 4.6,
    ratingCount: 5,
    bookingContext: {
      kind: 'HOST_STAY',
      title: 'Host stay',
      detailLabel: 'Dates',
      detailValue: 'Sep 1 – Sep 30, 2026',
      statusLabel: 'Pending',
      statusTone: 'warning',
    },
  },
];

export const chatMessagesByConversation: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1',
      senderId: 'host-1',
      text: 'Hi! We saw your booking request and would love to host you.',
      sentAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      isOwn: false,
    },
    {
      id: 'm2',
      senderId: 'self',
      text: 'Thank you! I am excited about the weekly meal plan you mentioned.',
      sentAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm3',
      senderId: 'host-1',
      text: 'Your room is ready for your arrival',
      sentAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      isOwn: false,
    },
  ],
  'conv-2': [
    {
      id: 'm1',
      senderId: 'self',
      text: 'Is the Cape Coast Castle tour still available this week?',
      sentAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm2',
      senderId: 'guide-1',
      text: 'I can meet you at the castle entrance at 10am.',
      sentAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isOwn: false,
    },
  ],
  'conv-3': [
    {
      id: 'm1',
      senderId: 'student-2',
      text: 'Thanks for reviewing my homestay request.',
      sentAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      isOwn: false,
    },
  ],
};

export function conversationFromId(conversationId: string): ConversationListItem {
  return (
    conversationsMock.find((c) => c.id === conversationId) ?? conversationsMock[0]
  );
}

export function messagesForConversation(conversationId: string): ChatMessage[] {
  return chatMessagesByConversation[conversationId] ?? [];
}

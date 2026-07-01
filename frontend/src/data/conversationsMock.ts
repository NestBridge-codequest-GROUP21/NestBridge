import type { ChatMessage, ConversationListItem } from '../types/messaging';

export const conversationsMock: ConversationListItem[] = [
  {
    id: 'conv-1',
    participantId: 'host-1',
    participantName: 'Abena Mensah',
    participantInitials: 'AM',
    participantRole: 'host',
    lastMessage: 'Looking forward to welcoming you in September!',
    lastMessageAt: '2026-06-28T09:15:00',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    participantId: 'guide-1',
    participantName: 'Kofi Asante',
    participantInitials: 'KA',
    participantRole: 'guide',
    lastMessage: 'I can meet you at Osu Castle entrance at 10am.',
    lastMessageAt: '2026-06-27T16:40:00',
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    participantId: 'student-2',
    participantName: 'James Osei',
    participantInitials: 'JO',
    participantRole: 'guest',
    lastMessage: 'Thanks for reviewing my homestay request.',
    lastMessageAt: '2026-06-26T11:02:00',
    unreadCount: 0,
  },
];

export const chatMessagesByConversation: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1',
      senderId: 'host-1',
      text: 'Hi Akosua! We saw your booking request and would love to host you.',
      sentAt: '2026-06-28T08:50:00',
      isOwn: false,
    },
    {
      id: 'm2',
      senderId: 'self',
      text: 'Thank you! I am excited about the weekly meal plan you mentioned.',
      sentAt: '2026-06-28T09:00:00',
      isOwn: true,
    },
    {
      id: 'm3',
      senderId: 'host-1',
      text: 'Looking forward to welcoming you in September!',
      sentAt: '2026-06-28T09:15:00',
      isOwn: false,
    },
  ],
  'conv-2': [
    {
      id: 'm1',
      senderId: 'self',
      text: 'Is the food tour still available on Sep 5?',
      sentAt: '2026-06-27T16:20:00',
      isOwn: true,
    },
    {
      id: 'm2',
      senderId: 'guide-1',
      text: 'I can meet you at Osu Castle entrance at 10am.',
      sentAt: '2026-06-27T16:40:00',
      isOwn: false,
    },
  ],
  'conv-3': [
    {
      id: 'm1',
      senderId: 'student-2',
      text: 'Thanks for reviewing my homestay request.',
      sentAt: '2026-06-26T11:02:00',
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

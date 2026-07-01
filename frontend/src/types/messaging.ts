export interface ConversationListItem {
  id: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantRole: 'host' | 'guide' | 'guest';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  isOwn: boolean;
}

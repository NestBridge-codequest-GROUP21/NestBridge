import type { ProviderVerification } from './verification';

export type ConversationParticipantRole = 'host' | 'guide' | 'guest';

/** Marketplace booking/session context shown above a chat thread. */
export interface ConversationBookingContext {
  kind: 'HOST_STAY' | 'GUIDE_SESSION';
  title: string;
  detailLabel: string;
  detailValue: string;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'info' | 'neutral';
  bookingId?: string;
}

export interface ConversationListItem {
  id: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantRole: ConversationParticipantRole;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  firebasePath?: string;
  /** Host listing id or guide profile id for profile navigation. */
  profileTargetId?: string;
  verification?: ProviderVerification;
  /** Optional rating shown on profile header (e.g. 4.8). */
  rating?: number;
  ratingCount?: number;
  bookingContext?: ConversationBookingContext;
}

export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  isOwn: boolean;
  /** Client-side delivery hint for own messages — optional. */
  status?: ChatMessageStatus;
}

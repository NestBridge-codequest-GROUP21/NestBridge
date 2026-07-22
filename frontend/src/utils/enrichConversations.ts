import type { BookingListItem, BookingStatus } from '../types/booking';
import type {
  ConversationBookingContext,
  ConversationListItem,
} from '../types/messaging';
import type { ProviderVerification } from '../types/verification';

function statusMeta(
  status: BookingStatus,
  bookingType: BookingListItem['bookingType'],
): {
  label: string;
  tone: ConversationBookingContext['statusTone'];
} {
  switch (status) {
    case 'PENDING_HOST':
      return { label: 'Pending', tone: 'warning' };
    case 'ACCEPTED':
      return { label: 'Accepted', tone: 'info' };
    case 'CONFIRMED':
      return {
        label: bookingType === 'GUIDE' ? 'Confirmed' : 'Paid',
        tone: 'success',
      };
    case 'CHECKED_IN':
      return { label: 'Completed', tone: 'success' };
    case 'DECLINED':
      return { label: 'Declined', tone: 'neutral' };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral' };
    case 'EXPIRED':
      return { label: 'Expired', tone: 'neutral' };
    default:
      return { label: status, tone: 'neutral' };
  }
}

function formatStayDates(checkIn: string, checkOut: string): string {
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return `${checkIn} – ${checkOut}`;
    }
    const opts: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', {
      ...opts,
      year: 'numeric',
    })}`;
  } catch {
    return `${checkIn} – ${checkOut}`;
  }
}

function formatSessionWhen(booking: BookingListItem): string {
  const session = booking.session;
  if (!session) {
    return formatStayDates(booking.checkIn, booking.checkOut);
  }
  try {
    const date = new Date(`${session.sessionDate}T${session.sessionStartTime}`);
    if (Number.isNaN(date.getTime())) {
      return `${session.sessionDate} · ${session.sessionStartTime}`;
    }
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    if (sameDay(date, today)) {
      return `Today ${time}`;
    }
    if (sameDay(date, tomorrow)) {
      return `Tomorrow ${time}`;
    }
    return `${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} · ${time}`;
  } catch {
    return `${session.sessionDate} · ${session.sessionStartTime}`;
  }
}

function guideSessionTitle(booking: BookingListItem): string {
  const location = booking.hostLocation?.trim();
  if (location) {
    return `${location} tour`;
  }
  return 'Guided session';
}

function contextFromBooking(
  booking: BookingListItem,
): ConversationBookingContext {
  const meta = statusMeta(booking.status, booking.bookingType);
  if (booking.bookingType === 'GUIDE') {
    return {
      kind: 'GUIDE_SESSION',
      title: guideSessionTitle(booking),
      detailLabel: 'Date',
      detailValue: formatSessionWhen(booking),
      statusLabel: meta.label,
      statusTone: meta.tone,
      bookingId: booking.id,
    };
  }
  return {
    kind: 'HOST_STAY',
    title: 'Host stay',
    detailLabel: 'Dates',
    detailValue: formatStayDates(booking.checkIn, booking.checkOut),
    statusLabel: meta.label,
    statusTone: meta.tone,
    bookingId: booking.id,
  };
}

function pickRelatedBooking(
  conversation: ConversationListItem,
  bookings: BookingListItem[],
): BookingListItem | undefined {
  const name = conversation.participantName.trim().toLowerCase();
  const id = conversation.participantId;
  const target = conversation.profileTargetId;

  const roleBookings = bookings.filter((booking) => {
    if (conversation.participantRole === 'host') {
      return booking.bookingType === 'HOST';
    }
    if (conversation.participantRole === 'guide') {
      return booking.bookingType === 'GUIDE';
    }
    return true;
  });

  const byId = roleBookings.find(
    (booking) =>
      booking.hostId === target ||
      booking.hostId === id ||
      booking.id === target,
  );
  if (byId) {
    return byId;
  }

  return roleBookings.find(
    (booking) => booking.hostName.trim().toLowerCase() === name,
  );
}

export type ConversationProfileLookup = {
  id: string;
  userId?: string;
  name: string;
  verification?: ProviderVerification;
  rating?: number;
  ratingCount?: number;
  role: 'host' | 'guide';
};

/**
 * Enriches inbox rows with marketplace context from bookings + known profiles.
 * Pure client-side — no schema change required.
 */
export function enrichConversations(
  conversations: ConversationListItem[],
  bookings: BookingListItem[],
  profiles: ConversationProfileLookup[] = [],
): ConversationListItem[] {
  return conversations.map((conversation) => {
    const booking = pickRelatedBooking(conversation, bookings);
    const profile = profiles.find(
      (entry) =>
        entry.userId === conversation.participantId ||
        entry.id === conversation.profileTargetId ||
        entry.id === conversation.participantId ||
        entry.name.trim().toLowerCase() ===
          conversation.participantName.trim().toLowerCase(),
    );

    const verification = conversation.verification ?? profile?.verification;

    return {
      ...conversation,
      profileTargetId:
        conversation.profileTargetId ?? profile?.id ?? booking?.hostId,
      verification,
      rating: conversation.rating ?? profile?.rating,
      ratingCount: conversation.ratingCount ?? profile?.ratingCount,
      bookingContext:
        conversation.bookingContext ??
        (booking ? contextFromBooking(booking) : undefined),
    };
  });
}

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';
import type { ProviderBookingItem } from '../types/providerBooking';
import { formatBookingDate, formatCurrency } from '../data/bookingMock';
import { formatSessionSchedule } from '../data/guideSessionMock';

function scheduleLine(booking: ProviderBookingItem): string {
  if (booking.bookingType === 'GUIDE' && booking.session) {
    return formatSessionSchedule(
      booking.session.sessionDate,
      booking.session.sessionStartTime,
      booking.session.durationHours,
    );
  }
  return `${formatBookingDate(booking.checkIn)} – ${formatBookingDate(booking.checkOut)}`;
}

function statusLabel(status: ProviderBookingItem['status']): string {
  switch (status) {
    case 'ACCEPTED':
      return 'Awaiting payment';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'CHECKED_IN':
      return 'Checked in';
    default:
      return status;
  }
}

function statusColors(status: ProviderBookingItem['status']): { bg: string; text: string } {
  switch (status) {
    case 'ACCEPTED':
      return { bg: colors.warmCream, text: colors.warning };
    case 'CONFIRMED':
    case 'CHECKED_IN':
      return { bg: colors.success, text: colors.white };
    default:
      return { bg: colors.border, text: colors.textSecondary };
  }
}

export interface ProviderBookingCardProps {
  booking: ProviderBookingItem;
  isLast?: boolean;
  onPress?: (bookingId: string) => void;
}

export default function ProviderBookingCard({
  booking,
  isLast = false,
  onPress,
}: ProviderBookingCardProps) {
  const statusStyle = statusColors(booking.status);
  const cardBody = (
    <>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{booking.guestInitials}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {booking.guestName}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusLabel(booking.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.schedule}>{scheduleLine(booking)}</Text>
        <Text style={styles.payout}>
          Payout {formatCurrency(booking.hostPayout, booking.currency)}
        </Text>
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.card, !isLast && styles.cardSpacing]}>{cardBody}</View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        !isLast && styles.cardSpacing,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(booking.id)}
      accessibilityRole="button"
      accessibilityLabel={`Booking with ${booking.guestName}`}
    >
      {cardBody}
    </Pressable>
  );
}

export interface ProviderBookingsEmptyBlockProps {
  title: string;
  body: string;
  tip?: string;
}

export function ProviderBookingsEmptyBlock({
  title,
  body,
  tip,
}: ProviderBookingsEmptyBlockProps) {
  return (
    <View style={styles.emptyBlock}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {tip ? <Text style={styles.emptyTip}>{tip}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  statusPill: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  schedule: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  payout: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  emptyBlock: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyTip: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
});

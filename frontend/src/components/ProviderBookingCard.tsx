import { useThemedStyles, type AppTheme, useTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Avatar from './Avatar';
import Card from './Card';
import EmptyState from './EmptyState';
import StatusBadge, { type StatusBadgeTone } from './StatusBadge';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
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

function statusMeta(status: ProviderBookingItem['status']): {
  label: string;
  tone: StatusBadgeTone;
} {
  switch (status) {
    case 'ACCEPTED':
      return { label: 'Awaiting payment', tone: 'warning' };
    case 'CONFIRMED':
      return { label: 'Confirmed', tone: 'success' };
    case 'CHECKED_IN':
      return { label: 'Checked in', tone: 'success' };
    default:
      return { label: status, tone: 'neutral' };
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
  const styles = useThemedStyles(createStyles);

  const status = statusMeta(booking.status);
  const cardBody = (
    <>
      <Avatar initials={booking.guestInitials} size="lg" />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {booking.guestName}
          </Text>
          <StatusBadge label={status.label} tone={status.tone} />
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
      <Card style={[styles.card, !isLast && styles.cardSpacing]} padding="lg">
        {cardBody}
      </Card>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [!isLast && styles.cardSpacing, pressed && styles.pressed]}
      onPress={() => onPress(booking.id)}
      accessibilityRole="button"
      accessibilityLabel={`Booking with ${booking.guestName}`}
    >
      <Card style={styles.card} padding="lg">
        {cardBody}
      </Card>
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
  const styles = useThemedStyles(createStyles);

  return (
    <EmptyState
      title={title}
      body={body}
      tip={tip}
      iconName="calendar-outline"
      style={styles.emptySpacing}
    />
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.92,
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
  emptySpacing: {
    marginBottom: spacing.lg,
  },
});
}


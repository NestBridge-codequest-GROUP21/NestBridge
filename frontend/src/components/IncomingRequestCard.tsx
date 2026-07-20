import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Avatar from './Avatar';
import Card from './Card';
import EmptyState from './EmptyState';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
} from '../constants/theme';
import type { IncomingBookingRequest } from '../types/booking';
import { formatBookingDate } from '../data/bookingMock';
import { formatSessionSchedule } from '../data/guideSessionMock';

function requestScheduleLine(request: IncomingBookingRequest): string {
  if (request.bookingType === 'GUIDE' && request.session) {
    return formatSessionSchedule(
      request.session.sessionDate,
      request.session.sessionStartTime,
      request.session.durationHours,
    );
  }
  return `${formatBookingDate(request.checkIn)} – ${formatBookingDate(request.checkOut)}`;
}

export interface IncomingRequestCardProps {
  request: IncomingBookingRequest;
  isLast?: boolean;
  onPress?: (requestId: string) => void;
}

export default function IncomingRequestCard({
  request,
  isLast = false,
  onPress,
}: IncomingRequestCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        !isLast && styles.requestCardSpacing,
        !request.capacity.canAccept && styles.requestCardMuted,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(request.id)}
      accessibilityRole="button"
      accessibilityLabel={`Review request from ${request.studentName}`}
    >
      <Card style={styles.requestCard} padding="lg">
        <Avatar initials={request.studentInitials} size="lg" />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {request.studentName}
            </Text>
            <Text style={styles.score}>{request.compatibilityScore}%</Text>
          </View>
          <Text style={styles.dates}>{requestScheduleLine(request)}</Text>
          <Text style={styles.capacity} numberOfLines={1}>
            {request.bookingType === 'GUIDE'
              ? `${request.seekerRole === 'TOURIST' ? 'Tourist' : 'Student'} · `
              : ''}
            {request.capacity.canAccept
              ? `${request.capacity.overlappingAccepted} of ${request.capacity.maxAllowed} slots used`
              : request.capacity.declineReason ?? 'At capacity'}
          </Text>
        </View>

        <Text style={styles.listAction}>Open</Text>
      </Card>
    </Pressable>
  );
}

export interface IncomingRequestsEmptyBlockProps {
  title: string;
  body: string;
  tip?: string;
}

export function IncomingRequestsEmptyBlock({
  title,
  body,
  tip,
}: IncomingRequestsEmptyBlockProps) {
  return (
    <EmptyState
      title={title}
      body={body}
      tip={tip}
      iconName="mail-open-outline"
    />
  );
}

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  requestCardSpacing: {
    marginBottom: spacing.md,
  },
  requestCardMuted: {
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  score: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  dates: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  capacity: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  listAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
});

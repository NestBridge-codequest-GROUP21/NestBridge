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
        styles.requestCard,
        !isLast && styles.requestCardSpacing,
        !request.capacity.canAccept && styles.requestCardMuted,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(request.id)}
      accessibilityRole="button"
      accessibilityLabel={`Review request from ${request.studentName}`}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{request.studentInitials}</Text>
      </View>

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
    <View style={styles.emptyBlock}>
      <Text style={styles.emptyIcon} accessibilityElementsHidden>
        📬
      </Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {tip ? <Text style={styles.emptyTip}>{tip}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
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
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  score: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
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
    marginLeft: spacing.sm,
  },
  emptyBlock: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: fontSizes.display,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyTip: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});

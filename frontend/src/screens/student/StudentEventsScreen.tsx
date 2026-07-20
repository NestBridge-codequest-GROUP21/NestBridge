import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ListRow from '../../components/ListRow';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import SkeletonLoader from '../../components/SkeletonLoader';
import StatusBadge from '../../components/StatusBadge';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  layout,
  tints,
} from '../../constants/theme';
import {
  EVENT_ORGANIZER_META,
  EVENT_TYPE_META,
  type StudentEvent,
} from '../../data/studentEventsMock';

export interface StudentEventsScreenProps {
  events: StudentEvent[];
  joinedIds: string[];
  isLoading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onCreatePress?: () => void;
  onRetry?: () => void;
  onToggleJoin?: (eventId: string) => void;
}

function EventCard({
  event,
  joined,
  onToggleJoin,
}: {
  event: StudentEvent;
  joined: boolean;
  onToggleJoin?: (eventId: string) => void;
}) {
  const typeMeta = EVENT_TYPE_META[event.type];
  const organizerMeta = EVENT_ORGANIZER_META[event.organizerKind];
  const attending = event.attending + (joined ? 1 : 0);
  const spotsLeft = Math.max(0, event.capacity - attending);
  const isFull = spotsLeft === 0 && !joined;

  return (
    <Card style={styles.card} padding="lg">
      <View style={styles.tagRow}>
        <View style={styles.typeTag}>
          <AppIcon glyph={typeMeta.icon} size={iconSizes.sm} color={colors.textPrimary} />
          <Text style={styles.typeTagText}>{typeMeta.label}</Text>
        </View>
        <StatusBadge label={organizerMeta.label} tone="neutral" />
        {event.hostedByYou ? (
          <StatusBadge label="Your event" tone="info" />
        ) : null}
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.organizerRow}>
        <Avatar initials={event.organizerInitials} size="sm" />
        <Text style={styles.organizerName}>{event.organizerName}</Text>
      </View>

      <View style={styles.metaRow}>
        <AppIcon name="calendar-outline" size={iconSizes.sm} color={colors.textSecondary} />
        <Text style={styles.metaText}>{event.dateLabel}</Text>
      </View>
      <View style={styles.metaRow}>
        <AppIcon name="location-outline" size={iconSizes.sm} color={colors.textSecondary} />
        <Text style={styles.metaText}>{event.location}</Text>
      </View>

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.spots}>
          {attending} going{spotsLeft > 0 ? ` · ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left` : ' · Full'}
        </Text>
        {event.hostedByYou ? (
          <StatusBadge label="Hosting" tone="neutral" style={styles.hostingBadge} />
        ) : joined ? (
          <SecondaryButton
            label="Joined"
            onPress={() => onToggleJoin?.(event.id)}
            style={styles.joinButton}
          />
        ) : (
          <PrimaryButton
            label={isFull ? 'Full' : 'Join'}
            onPress={() => onToggleJoin?.(event.id)}
            disabled={isFull}
            style={styles.joinButton}
          />
        )}
      </View>
    </Card>
  );
}

export default function StudentEventsScreen({
  events,
  joinedIds,
  isLoading = false,
  error,
  onBack,
  onCreatePress,
  onRetry,
  onToggleJoin,
}: StudentEventsScreenProps) {
  const showLoading = isLoading && events.length === 0;
  const showError = !!error && events.length === 0;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Student events"
        subtitle="Meetups, campus trips, and get-togethers for students in Ghana"
        onBack={onBack}
      />

      <ScreenScroll>
        <Card padding="none" style={styles.createCard}>
          <ListRow
            title="Host your own"
            subtitle="Post a cook-out, trip, or hangout for other students to join"
            iconName="add-circle-outline"
            onPress={onCreatePress}
            bordered={false}
          />
        </Card>

        {showLoading ? (
          <>
            <SkeletonLoader style={styles.skeleton} />
            <SkeletonLoader style={styles.skeleton} lines={2} />
          </>
        ) : showError ? (
          <EmptyState
            iconName="cloud-offline-outline"
            title="Couldn't load events"
            body={error ?? 'Something went wrong. Please try again.'}
            primaryActionLabel={onRetry ? 'Try again' : undefined}
            onPrimaryAction={onRetry}
          />
        ) : events.length === 0 ? (
          <EmptyState
            iconName="balloon-outline"
            title="No events yet"
            body="Be the first to bring students together — tap Host your own above."
            tip="Cook-outs, market walks, and weekend trips fill up fast near campus."
          />
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              joined={joinedIds.includes(event.id)}
              onToggleJoin={onToggleJoin}
            />
          ))
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  createCard: {
    marginBottom: layout.sectionGap,
    backgroundColor: colors.warmCream,
  },
  card: {
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tints.navy,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  typeTagText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.subheading,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  organizerName: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  metaText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: lineHeights.body,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  spots: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  joinButton: {
    minWidth: spacing.xxl + spacing.xl,
    minHeight: touchTarget,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  hostingBadge: {
    alignSelf: 'center',
  },
  skeleton: {
    marginBottom: spacing.md,
  },
});

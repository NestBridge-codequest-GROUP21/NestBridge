import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
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
    <View style={styles.card}>
      <View style={styles.tagRow}>
        <View style={styles.typeTag}>
          <AppIcon glyph={typeMeta.icon} size={fontSizes.caption} color={colors.textPrimary} />
          <Text style={styles.typeTagText}>{typeMeta.label}</Text>
        </View>
        <View style={styles.organizerTag}>
          <Text style={styles.organizerTagText}>{organizerMeta.label}</Text>
        </View>
        {event.hostedByYou ? (
          <View style={styles.yoursTag}>
            <Text style={styles.yoursTagText}>Your event</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.organizerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{event.organizerInitials}</Text>
        </View>
        <Text style={styles.organizerName}>{event.organizerName}</Text>
      </View>

      <View style={styles.metaRow}>
        <AppIcon name="calendar-outline" size={fontSizes.caption} color={colors.textSecondary} />
        <Text style={styles.metaText}>{event.dateLabel}</Text>
      </View>
      <View style={styles.metaRow}>
        <AppIcon name="location-outline" size={fontSizes.caption} color={colors.textSecondary} />
        <Text style={styles.metaText}>{event.location}</Text>
      </View>

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.spots}>
          {attending} going{spotsLeft > 0 ? ` · ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left` : ' · Full'}
        </Text>
        {event.hostedByYou ? (
          <View style={styles.hostingPill}>
            <Text style={styles.hostingPillText}>Hosting</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.joinButton,
              joined && styles.joinButtonJoined,
              isFull && styles.joinButtonDisabled,
              pressed && styles.joinButtonPressed,
            ]}
            onPress={() => onToggleJoin?.(event.id)}
            disabled={isFull}
            accessibilityRole="button"
            accessibilityState={{ selected: joined, disabled: isFull }}
            accessibilityLabel={
              joined ? `Leave ${event.title}` : `Join ${event.title}`
            }
          >
            <Text
              style={[styles.joinButtonText, joined && styles.joinButtonTextJoined]}
            >
              {joined ? 'Joined ✓' : isFull ? 'Full' : 'Join'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
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
        subtitle="Meetups, trips & get-togethers for exchange students"
        onBack={onBack}
      />

      <ScreenScroll>
        <Pressable
          style={({ pressed }) => [styles.createCard, pressed && styles.createCardPressed]}
          onPress={onCreatePress}
          accessibilityRole="button"
          accessibilityLabel="Create an event"
        >
          <View style={styles.createIconWrap}>
            <AppIcon name="add" size={28} color={colors.white} />
          </View>
          <View style={styles.createTextWrap}>
            <Text style={styles.createTitle}>Host your own</Text>
            <Text style={styles.createSubtitle}>
              Post a party, trip, or hangout for other students to join
            </Text>
          </View>
        </Pressable>

        {showLoading ? (
          <View style={styles.stateBlock}>
            <ActivityIndicator color={colors.teal} />
            <Text style={styles.stateText}>Loading events…</Text>
          </View>
        ) : showError ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>Couldn't load events</Text>
            <Text style={styles.emptyBody}>{error}</Text>
            {onRetry ? (
              <Pressable
                style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
                onPress={onRetry}
                accessibilityRole="button"
                accessibilityLabel="Try again"
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyBody}>
              Be the first to bring students together — tap “Host your own” above.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  createCardPressed: {
    opacity: 0.92,
  },
  createIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    color: colors.white,
  },
  createTextWrap: {
    flex: 1,
  },
  createTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  createSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
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
    backgroundColor: colors.background,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  typeTagIcon: {
    fontSize: fontSizes.caption,
  },
  typeTagText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  organizerTag: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  organizerTagText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  yoursTag: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  yoursTagText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    color: colors.white,
  },
  organizerName: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  metaIcon: {
    fontSize: fontSizes.caption,
  },
  metaText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
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
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonJoined: {
    backgroundColor: colors.success,
  },
  joinButtonDisabled: {
    backgroundColor: colors.border,
  },
  joinButtonPressed: {
    opacity: 0.9,
  },
  joinButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  joinButtonTextJoined: {
    color: colors.white,
  },
  hostingPill: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostingPillText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  stateBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  stateText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  emptyBlock: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryPressed: {
    opacity: 0.9,
  },
  retryText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
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
  },
});

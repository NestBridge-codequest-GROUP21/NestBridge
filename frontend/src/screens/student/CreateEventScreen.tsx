import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
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
  EVENT_ORGANIZER_ORDER,
  EVENT_TYPE_META,
  EVENT_TYPE_ORDER,
  type StudentEventDraft,
  type StudentEventOrganizerKind,
  type StudentEventType,
} from '../../data/studentEventsMock';

export interface CreateEventScreenProps {
  onBack?: () => void;
  onSubmit?: (draft: StudentEventDraft) => void | Promise<void>;
}

export default function CreateEventScreen({
  onBack,
  onSubmit,
}: CreateEventScreenProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<StudentEventType>('MEETUP');
  const [organizerKind, setOrganizerKind] =
    useState<StudentEventOrganizerKind>('STUDENT');
  const [dateLabel, setDateLabel] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }
    if (!title.trim()) {
      setError('Give your event a title.');
      return;
    }
    if (!dateLabel.trim()) {
      setError('Add a date and time so people know when to show up.');
      return;
    }
    if (!location.trim()) {
      setError('Add a location.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit?.({
        title: title.trim(),
        type,
        organizerKind,
        dateLabel: dateLabel.trim(),
        location: location.trim(),
        capacity: capacity.trim(),
        description: description.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not post your event. Try again.',
      );
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Host an event"
        subtitle="Set up a party, trip, or hangout for other students"
        onBack={onBack}
      />

      <ScreenScroll keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Event title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sunday jollof cook-off"
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
          accessibilityLabel="Event title"
        />

        <Text style={styles.label}>What kind of event?</Text>
        <View style={styles.chipRow}>
          {EVENT_TYPE_ORDER.map((option) => {
            const meta = EVENT_TYPE_META[option];
            const active = option === type;
            return (
              <Pressable
                key={option}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setType(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={meta.label}
              >
                <AppIcon
                  glyph={meta.icon}
                  size={fontSizes.caption}
                  color={active ? colors.white : colors.textSecondary}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Who's hosting?</Text>
        <View style={styles.chipRow}>
          {EVENT_ORGANIZER_ORDER.map((option) => {
            const meta = EVENT_ORGANIZER_META[option];
            const active = option === organizerKind;
            return (
              <Pressable
                key={option}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setOrganizerKind(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={meta.label}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Date & time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sat, Jul 18 · 5:00 PM"
          placeholderTextColor={colors.textTertiary}
          value={dateLabel}
          onChangeText={setDateLabel}
          accessibilityLabel="Date and time"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Campus common room, Block C"
          placeholderTextColor={colors.textTertiary}
          value={location}
          onChangeText={setLocation}
          accessibilityLabel="Location"
        />

        <Text style={styles.label}>Spots available</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 20"
          placeholderTextColor={colors.textTertiary}
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
          accessibilityLabel="Spots available"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What should people expect? What to bring?"
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Description"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={submitting ? 'Posting…' : 'Post event'}
          onPress={handleSubmit}
          disabled={submitting}
          style={styles.submit}
        />
        <Text style={styles.helper}>
          Your event appears in the Student events feed for others to join.
        </Text>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 108,
    paddingTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  chipIcon: {
    fontSize: fontSizes.caption,
  },
  chipText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  error: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.danger,
    marginTop: spacing.md,
  },
  submit: {
    marginTop: spacing.lg,
  },
  helper: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

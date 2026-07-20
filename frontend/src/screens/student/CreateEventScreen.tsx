import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import PrimaryButton from '../../components/PrimaryButton';
import FormTextField from '../../components/FormTextField';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import InlineBanner from '../../components/InlineBanner';
import SectionHeader from '../../components/SectionHeader';
import KeyboardSafeView from '../../components/KeyboardSafeView';
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
    <KeyboardSafeView style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Host an event"
        subtitle="Invite other students to a meetup, trip, or hangout around campus"
        onBack={onBack}
      />

      <ScreenScroll>
        <FormTextField
          label="Event title"
          value={title}
          placeholder="e.g. Sunday jollof cook-off"
          onChangeText={setTitle}
        />

        <SectionHeader title="What kind of event?" style={styles.chipSection} />
        <Card padding="md" style={styles.chipCard}>
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
                    size={iconSizes.sm}
                    color={active ? colors.white : colors.textSecondary}
                  />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {meta.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <SectionHeader title="Who's hosting?" style={styles.chipSection} />
        <Card padding="md" style={styles.chipCard}>
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
        </Card>

        <FormTextField
          label="Date & time"
          value={dateLabel}
          placeholder="e.g. Sat, Jul 18 · 5:00 PM"
          onChangeText={setDateLabel}
        />

        <FormTextField
          label="Location"
          value={location}
          placeholder="e.g. UG common room, Legon"
          onChangeText={setLocation}
        />

        <FormTextField
          label="Spots available"
          value={capacity}
          placeholder="e.g. 20"
          onChangeText={setCapacity}
          keyboardType="number-pad"
        />

        <FormTextField
          label="Description"
          value={description}
          placeholder="What should people expect? What to bring?"
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {error ? <InlineBanner message={error} tone="error" style={styles.errorBanner} /> : null}

        <PrimaryButton
          label="Post event"
          onPress={handleSubmit}
          disabled={submitting}
          loading={submitting}
          style={styles.submit}
        />
        <Text style={styles.helper}>
          Your event appears in the Student events feed for others nearby to join.
        </Text>
      </ScreenScroll>
    </KeyboardSafeView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chipSection: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  chipCard: {
    marginBottom: spacing.md,
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
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
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
  errorBanner: {
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  submit: {
    marginTop: layout.sectionGap,
  },
  helper: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: lineHeights.caption,
  },
});

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import MonthCalendarGrid, {
  buildGuideCalendarGrid,
} from '../../components/MonthCalendarGrid';
import type { GuideCalendarDay, GuideShiftBlock } from '../../data/featureScreensMock';
import { GUIDE_SHIFT_LABELS } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

export interface GuideAvailabilityScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  calendarTitle: string;
  monthLabel: string;
  startWeekday: number;
  days: GuideCalendarDay[];
  onBack?: () => void;
}

function ShiftDetailCard({ shifts }: { shifts: GuideShiftBlock[] }) {
  if (shifts.length === 0) {
    return (
      <View style={styles.shiftCard}>
        <Text style={styles.shiftTitle}>No shifts scheduled</Text>
        <Text style={styles.shiftDetail}>Tap a day to manage availability</Text>
      </View>
    );
  }

  return (
    <View style={styles.shiftCard}>
      <Text style={styles.shiftTitle}>Working shifts</Text>
      {shifts.map((shift) => (
        <View key={shift} style={styles.shiftRow}>
          <View style={[styles.shiftDot, shiftDotStyle(shift)]} />
          <Text style={styles.shiftDetail}>{GUIDE_SHIFT_LABELS[shift]}</Text>
        </View>
      ))}
    </View>
  );
}

function shiftDotStyle(shift: GuideShiftBlock) {
  switch (shift) {
    case 'morning':
      return { backgroundColor: colors.success };
    case 'afternoon':
      return { backgroundColor: colors.warning };
    case 'evening':
      return { backgroundColor: colors.tealDeep };
    default:
      return { backgroundColor: colors.border };
  }
}

export default function GuideAvailabilityScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  calendarTitle,
  monthLabel,
  startWeekday,
  days,
  onBack,
}: GuideAvailabilityScreenProps) {
  const [selectedDay, setSelectedDay] = useState(11);

  const gridDays = useMemo(
    () => buildGuideCalendarGrid(days, startWeekday),
    [days, startWeekday],
  );

  const selectedShifts =
    days.find((d) => d.day === selectedDay)?.shifts ?? [];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <Text style={styles.screenTitle}>{calendarTitle}</Text>
        <Text style={styles.screenSubtitle}>
          Manage Morning, Afternoon, and Evening availability blocks.
        </Text>

        <MonthCalendarGrid
          monthLabel={monthLabel}
          mode="guide"
          guideDays={gridDays}
          selectedDay={selectedDay}
          onDayPress={setSelectedDay}
        />

        <ShiftDetailCard shifts={selectedShifts} />
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  shiftCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  shiftTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  shiftDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.pill,
  },
  shiftDetail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
});

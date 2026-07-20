import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import InlineBanner from '../../components/InlineBanner';
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
  lineHeights,
  shadows,
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
  editable?: boolean;
  statusMessage?: string | null;
  onSelectedDayChange?: (day: number) => void;
  onShiftToggle?: (shift: GuideShiftBlock, enabled: boolean) => void;
  onBack?: () => void;
}

const GUIDE_SHIFTS: GuideShiftBlock[] = ['morning', 'afternoon', 'evening'];

function ShiftDetailCard({
  shifts,
  editable,
  onShiftToggle,
}: {
  shifts: GuideShiftBlock[];
  editable?: boolean;
  onShiftToggle?: (shift: GuideShiftBlock, enabled: boolean) => void;
}) {
  if (!editable) {
    if (shifts.length === 0) {
      return (
        <View style={styles.shiftCard}>
          <Text style={styles.shiftTitle}>No shifts scheduled</Text>
          <Text style={styles.shiftDetailMuted}>Tap a day to manage availability</Text>
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

  return (
    <View style={styles.shiftCard}>
      <Text style={styles.shiftTitle}>Shifts for selected day</Text>
      {GUIDE_SHIFTS.map((shift) => {
        const enabled = shifts.includes(shift);
        return (
          <View key={shift} style={styles.shiftToggleRow}>
            <View style={styles.shiftToggleInfo}>
              <View style={[styles.shiftDot, shiftDotStyle(shift)]} />
              <Text style={styles.shiftDetail}>{GUIDE_SHIFT_LABELS[shift]}</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={(value) => onShiftToggle?.(shift, value)}
              trackColor={{ false: colors.border, true: colors.tealBright }}
              thumbColor={colors.white}
              accessibilityLabel={`Toggle ${GUIDE_SHIFT_LABELS[shift]} for selected day`}
            />
          </View>
        );
      })}
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
  editable = false,
  statusMessage,
  onSelectedDayChange,
  onShiftToggle,
  onBack,
}: GuideAvailabilityScreenProps) {
  const [selectedDay, setSelectedDay] = useState(11);

  const gridDays = useMemo(
    () => buildGuideCalendarGrid(days, startWeekday),
    [days, startWeekday],
  );

  const selectedShifts =
    days.find((day) => day.day === selectedDay)?.shifts ?? [];

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    onSelectedDayChange?.(day);
  };

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
          {editable
            ? 'Tap a day, then toggle Morning, Afternoon, or Evening shifts below.'
            : 'Manage Morning, Afternoon, and Evening availability blocks.'}
        </Text>

        <MonthCalendarGrid
          monthLabel={monthLabel}
          mode="guide"
          guideDays={gridDays}
          selectedDay={selectedDay}
          onDayPress={handleDayPress}
        />

        {statusMessage ? (
          <InlineBanner message={statusMessage} tone="info" style={styles.statusBanner} />
        ) : null}

        <ShiftDetailCard
          shifts={selectedShifts}
          editable={editable}
          onShiftToggle={onShiftToggle}
        />
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
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  statusBanner: {
    marginTop: spacing.md,
  },
  shiftCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  shiftTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
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
    minHeight: 44,
  },
  shiftToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  shiftToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  shiftDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.pill,
  },
  shiftDetail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  shiftDetailMuted: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
});

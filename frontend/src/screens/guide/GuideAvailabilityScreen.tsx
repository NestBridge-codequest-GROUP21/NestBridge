import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import SectionHeader from '../../components/SectionHeader';
import MonthCalendarGrid, {
  buildGuideCalendarGrid,
} from '../../components/MonthCalendarGrid';
import type { GuideCalendarDay, GuideShiftBlock } from '../../data/featureScreensMock';
import { GUIDE_SHIFT_LABELS } from '../../data/featureScreensMock';
import { emptyStates } from '../../data/appCopy';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  touchTarget,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (!editable) {
    if (shifts.length === 0) {
      const empty = emptyStates.guideAvailability;
      return (
        <EmptyState
          title={empty.title}
          body={empty.body}
          tip={empty.tip}
          iconGlyph={empty.iconGlyph}
          style={styles.shiftCard}
        />
      );
    }

    return (
      <Card padding="lg" style={styles.shiftCard}>
        <Text style={styles.shiftTitle}>Working shifts</Text>
        {shifts.map((shift) => (
          <View key={shift} style={styles.shiftRow}>
            <View style={[styles.shiftDot, shiftDotStyle(shift, colors)]} />
            <Text style={styles.shiftDetail}>{GUIDE_SHIFT_LABELS[shift]}</Text>
          </View>
        ))}
      </Card>
    );
  }

  return (
    <Card padding="lg" style={styles.shiftCard}>
      <Text style={styles.shiftTitle}>Shifts for selected day</Text>
      {GUIDE_SHIFTS.map((shift) => {
        const enabled = shifts.includes(shift);
        return (
          <View key={shift} style={styles.shiftToggleRow}>
            <View style={styles.shiftToggleInfo}>
              <View style={[styles.shiftDot, shiftDotStyle(shift, colors)]} />
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
    </Card>
  );
}

function shiftDotStyle(
  shift: GuideShiftBlock,
  colors: AppTheme['colors'],
) {
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


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
        <SectionHeader
          title={calendarTitle}
          subtitle={
            editable
              ? 'Tap a day, then toggle Morning, Afternoon, or Evening shifts below.'
              : 'Manage Morning, Afternoon, and Evening availability blocks.'
          }
        />

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

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBanner: {
    marginTop: spacing.md,
  },
  shiftCard: {
    marginTop: spacing.lg,
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
    minHeight: touchTarget,
  },
  shiftToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: touchTarget,
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
}


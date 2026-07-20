import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
} from '../constants/theme';
import type { CalendarDayStatus, GuideShiftBlock } from '../data/featureScreensMock';
import { GUIDE_SHIFT_LABELS } from '../data/featureScreensMock';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type HostCalendarDayCell = {
  day: number;
  status: CalendarDayStatus;
  isCurrentMonth: boolean;
};

export type GuideCalendarDayCell = {
  day: number;
  shifts: GuideShiftBlock[];
  isCurrentMonth: boolean;
};

export interface MonthCalendarGridProps {
  monthLabel: string;
  mode: 'host' | 'guide';
  hostDays?: HostCalendarDayCell[];
  guideDays?: GuideCalendarDayCell[];
  selectedDay?: number;
  onDayPress?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

function statusColor(
  status: CalendarDayStatus,
  colors: AppTheme['colors'],
): string {
  switch (status) {
    case 'available':
      return colors.success;
    case 'booked':
      return colors.danger;
    case 'blocked':
      return colors.textTertiary;
    default:
      return colors.border;
  }
}

function HostDayCell({
  cell,
  selected,
  onPress,
}: {
  cell: HostCalendarDayCell;
  selected: boolean;
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (!cell.isCurrentMonth) {
    return <View style={styles.dayCell} />;
  }

  const bg = statusColor(cell.status, colors);

  return (
    <Pressable
      style={[styles.dayCell, selected && styles.dayCellSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${cell.day}, ${cell.status}`}
    >
      <View style={[styles.dayBadge, { backgroundColor: bg }]}>
        <Text style={styles.dayNumber}>{cell.day}</Text>
      </View>
    </Pressable>
  );
}

function GuideDayCell({
  cell,
  selected,
  onPress,
}: {
  cell: GuideCalendarDayCell;
  selected: boolean;
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (!cell.isCurrentMonth) {
    return <View style={styles.dayCell} />;
  }

  const shiftColors: Record<GuideShiftBlock, string> = {
    morning: colors.success,
    afternoon: colors.warning,
    evening: colors.tealDeep,
  };

  return (
    <Pressable
      style={[styles.dayCell, selected && styles.dayCellSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${cell.day}`}
    >
      <Text style={styles.guideDayNumber}>{cell.day}</Text>
      <View style={styles.shiftDots}>
        {cell.shifts.map((shift) => (
          <View
            key={shift}
            style={[styles.shiftDot, { backgroundColor: shiftColors[shift] }]}
          />
        ))}
      </View>
    </Pressable>
  );
}

export default function MonthCalendarGrid({
  monthLabel,
  mode,
  hostDays = [],
  guideDays = [],
  selectedDay,
  onDayPress,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarGridProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const days = mode === 'host' ? hostDays : guideDays;

  return (
    <View style={styles.container}>
      <View style={styles.monthNav}>
        <Pressable
          onPress={onPrevMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Text style={styles.navArrow}>{'<'}</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable
          onPress={onNextMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Text style={styles.navArrow}>{'>'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((cell, index) => {
          const dayNum = cell.day;
          const selected = selectedDay === dayNum && cell.isCurrentMonth;
          const key = `${mode}-${index}`;

          if (mode === 'host') {
            return (
              <HostDayCell
                key={key}
                cell={cell as HostCalendarDayCell}
                selected={selected}
                onPress={() => onDayPress?.(dayNum)}
              />
            );
          }

          return (
            <GuideDayCell
              key={key}
              cell={cell as GuideCalendarDayCell}
              selected={selected}
              onPress={() => onDayPress?.(dayNum)}
            />
          );
        })}
      </View>

      {mode === 'host' ? (
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.textTertiary }]} />
            <Text style={styles.legendText}>Blocked by host</Text>
          </View>
        </View>
      ) : (
        <View style={styles.legendRow}>
          {(Object.keys(GUIDE_SHIFT_LABELS) as GuideShiftBlock[]).map((shift) => {
            const shiftColors: Record<GuideShiftBlock, string> = {
              morning: colors.success,
              afternoon: colors.warning,
              evening: colors.tealDeep,
            };
            return (
              <View key={shift} style={styles.legendItem}>
                <View
                  style={[styles.legendSwatch, { backgroundColor: shiftColors[shift] }]}
                />
                <Text style={styles.legendText}>{GUIDE_SHIFT_LABELS[shift]}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function buildHostCalendarGrid(
  days: { day: number; status: CalendarDayStatus }[],
  startWeekday: number,
): HostCalendarDayCell[] {
  const cells: HostCalendarDayCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ day: 0, status: 'available', isCurrentMonth: false });
  }
  days.forEach((d) => {
    cells.push({ day: d.day, status: d.status, isCurrentMonth: true });
  });
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, status: 'available', isCurrentMonth: false });
  }
  return cells;
}

export function buildGuideCalendarGrid(
  days: { day: number; shifts: GuideShiftBlock[] }[],
  startWeekday: number,
): GuideCalendarDayCell[] {
  const cells: GuideCalendarDayCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ day: 0, shifts: [], isCurrentMonth: false });
  }
  days.forEach((d) => {
    cells.push({ day: d.day, shifts: d.shifts, isCurrentMonth: true });
  });
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, shifts: [], isCurrentMonth: false });
  }
  return cells;
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    padding: spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  monthLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  dayCellSelected: {
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warmCream,
  },
  dayBadge: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.onPrimary,
  },
  guideDayNumber: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  shiftDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  shiftDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.pill,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.sm,
  },
  legendText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
});
}


import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import MonthCalendarGrid, {
  buildHostCalendarGrid,
} from '../../components/MonthCalendarGrid';
import type { ActiveBookingDetail, HostCalendarDay } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

export interface HostCalendarScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  calendarTitle: string;
  monthLabel: string;
  startWeekday: number;
  days: HostCalendarDay[];
  activeBooking: ActiveBookingDetail;
  onBack?: () => void;
}

export default function HostCalendarScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  calendarTitle,
  monthLabel,
  startWeekday,
  days,
  activeBooking,
  onBack,
}: HostCalendarScreenProps) {
  const [selectedDay, setSelectedDay] = useState(10);

  const gridDays = useMemo(
    () => buildHostCalendarGrid(days, startWeekday),
    [days, startWeekday],
  );

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

        <MonthCalendarGrid
          monthLabel={monthLabel}
          mode="host"
          hostDays={gridDays}
          selectedDay={selectedDay}
          onDayPress={setSelectedDay}
        />

        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Active booking</Text>
          <Text style={styles.bookingDetail}>
            Guest: {activeBooking.guestName}, {activeBooking.dateRange}
          </Text>
          <Text style={styles.bookingTotal}>Total: {activeBooking.totalAmount}</Text>
        </View>
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
    marginBottom: spacing.lg,
  },
  bookingCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  bookingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  bookingDetail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bookingTotal: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
});

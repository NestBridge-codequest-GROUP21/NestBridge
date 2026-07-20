import { useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import InlineBanner from '../../components/InlineBanner';
import SectionHeader from '../../components/SectionHeader';
import MonthCalendarGrid, {
  buildHostCalendarGrid,
} from '../../components/MonthCalendarGrid';
import type { ActiveBookingDetail, HostCalendarDay } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
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
  editable?: boolean;
  statusMessage?: string | null;
  onDayInteract?: (day: number) => void;
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
  editable = false,
  statusMessage,
  onDayInteract,
  onBack,
}: HostCalendarScreenProps) {
  const styles = useThemedStyles(createStyles);

  const [selectedDay, setSelectedDay] = useState(10);

  const gridDays = useMemo(
    () => buildHostCalendarGrid(days, startWeekday),
    [days, startWeekday],
  );

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    if (editable) {
      onDayInteract?.(day);
    }
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
              ? 'Tap an open day to block or unblock it. Booked days cannot be changed.'
              : undefined
          }
        />

        <MonthCalendarGrid
          monthLabel={monthLabel}
          mode="host"
          hostDays={gridDays}
          selectedDay={selectedDay}
          onDayPress={handleDayPress}
        />

        {statusMessage ? (
          <InlineBanner message={statusMessage} tone="info" style={styles.statusBanner} />
        ) : null}

        <Card padding="lg" style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Active booking</Text>
          <Text style={styles.bookingDetail}>
            Guest: {activeBooking.guestName}, {activeBooking.dateRange}
          </Text>
          <Text style={styles.bookingTotal}>Total: {activeBooking.totalAmount}</Text>
        </Card>
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
  bookingCard: {
    marginTop: spacing.lg,
  },
  bookingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  bookingDetail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: lineHeights.body,
  },
  bookingTotal: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.teal,
  },
});
}


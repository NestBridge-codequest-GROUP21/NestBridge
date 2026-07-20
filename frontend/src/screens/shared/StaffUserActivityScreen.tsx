import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import type { AdminBookingActivity, AdminSosActivity } from '../../services/api';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
} from '../../constants/theme';

export interface StaffUserActivityScreenProps {
  userName: string;
  bookings: AdminBookingActivity[];
  sosAlerts: AdminSosActivity[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function bookingTone(
  status: string,
): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  const normalized = status.toLowerCase();
  if (normalized.includes('confirm') || normalized.includes('paid')) return 'success';
  if (normalized.includes('pending') || normalized.includes('request')) return 'warning';
  if (normalized.includes('cancel') || normalized.includes('fail')) return 'danger';
  return 'info';
}

export default function StaffUserActivityScreen({
  userName,
  bookings,
  sosAlerts,
  isLoading = false,
  errorMessage,
  onBack,
}: StaffUserActivityScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Activity"
        subtitle={userName}
        compact
        onBack={onBack}
      />
      <ScreenScroll>
        {isLoading ? <SkeletonLoader style={styles.loader} lines={4} /> : null}
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {!isLoading ? (
          <>
            <SectionHeader title="Recent bookings" />
            <Card style={styles.card} padding="lg">
              {bookings.length === 0 ? (
                <EmptyState
                  title="No recent bookings"
                  body="This user has no booking activity to show yet."
                  iconName="calendar-outline"
                  carded={false}
                />
              ) : (
                bookings.map((booking, index) => (
                  <View
                    key={booking.bookingId}
                    style={[
                      styles.item,
                      index > 0 && styles.itemBorder,
                    ]}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{booking.bookingType}</Text>
                      <StatusBadge
                        label={booking.status}
                        tone={bookingTone(booking.status)}
                      />
                    </View>
                    <Text style={styles.itemMeta}>
                      {[
                        booking.checkIn
                          ? `${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}`
                          : null,
                        booking.sessionDate
                          ? `Session ${formatDate(booking.sessionDate)}`
                          : null,
                        booking.totalPrice != null
                          ? `GHS ${Number(booking.totalPrice).toFixed(2)}`
                          : null,
                        booking.paymentStatus,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                    <Text style={styles.itemMeta}>
                      Created {formatDate(booking.createdAt)}
                    </Text>
                  </View>
                ))
              )}
            </Card>

            <SectionHeader title="SOS alerts" />
            <Card style={styles.card} padding="lg">
              {sosAlerts.length === 0 ? (
                <EmptyState
                  title="No SOS alerts"
                  body="This user has not triggered emergency help recently."
                  iconName="shield-checkmark-outline"
                  carded={false}
                />
              ) : (
                sosAlerts.map((alert, index) => (
                  <View
                    key={alert.sosId}
                    style={[
                      styles.item,
                      index > 0 && styles.itemBorder,
                    ]}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>
                        SOS · {formatDate(alert.triggeredAt)}
                      </Text>
                      <StatusBadge label="Logged" tone="danger" />
                    </View>
                    <Text style={styles.itemMeta}>
                      {[
                        alert.contactedEmergency ? 'Emergency contacted' : null,
                        alert.contactedSupport ? 'Support contacted' : null,
                        alert.locationLat != null && alert.locationLng != null
                          ? `${alert.locationLat}, ${alert.locationLng}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Logged'}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          </>
        ) : null}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  item: {
    paddingVertical: spacing.sm,
  },
  itemBorder: {
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  itemTitle: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  itemMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

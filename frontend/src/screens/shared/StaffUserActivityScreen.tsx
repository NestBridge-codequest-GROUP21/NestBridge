import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import InlineBanner from '../../components/InlineBanner';
import type { AdminBookingActivity, AdminSosActivity } from '../../services/api';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
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
        {isLoading ? (
          <ActivityIndicator color={colors.teal} style={styles.loader} />
        ) : null}
        {errorMessage ? <InlineBanner tone="error" message={errorMessage} /> : null}

        {!isLoading ? (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent bookings</Text>
              {bookings.length === 0 ? (
                <EmptyState
                  title="No recent bookings"
                  body="This user has no booking activity to show yet."
                  iconName="calendar-outline"
                  carded={false}
                />
              ) : (
                bookings.map((booking) => (
                  <View key={booking.bookingId} style={styles.item}>
                    <Text style={styles.itemTitle}>
                      {booking.bookingType} · {booking.status}
                    </Text>
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
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>SOS alerts</Text>
              {sosAlerts.length === 0 ? (
                <EmptyState
                  title="No SOS alerts"
                  body="This user has not triggered emergency help recently."
                  iconName="shield-checkmark-outline"
                  carded={false}
                />
              ) : (
                sosAlerts.map((alert) => (
                  <View key={alert.sosId} style={styles.item}>
                    <Text style={styles.itemTitle}>
                      SOS · {formatDate(alert.triggeredAt)}
                    </Text>
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
            </View>
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  item: {
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

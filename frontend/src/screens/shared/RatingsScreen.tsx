import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import type { BookingListItem } from '../../types/booking';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  touchTarget,
} from '../../constants/theme';

export interface RatingsScreenProps {
  userName: string;
  userInitials: string;
  pendingReviews: BookingListItem[];
  loading?: boolean;
  onRatePress?: (booking: BookingListItem) => void;
  onBack?: () => void;
}

function bookingLine(booking: BookingListItem): string {
  if (booking.bookingType === 'GUIDE' && booking.session?.sessionDate) {
    return booking.session.sessionDate;
  }
  if (booking.checkIn && booking.checkOut) {
    return `${booking.checkIn} → ${booking.checkOut}`;
  }
  return booking.hostLocation || 'Completed stay';
}

export default function RatingsScreen({
  userName,
  userInitials,
  pendingReviews,
  loading = false,
  onRatePress,
  onBack,
}: RatingsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Ratings"
        userName={userName}
        userInitials={userInitials}
        subtitle="Leave feedback after completed stays and sessions"
        onBack={onBack}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingLabel}>Loading stays to rate…</Text>
        </View>
      ) : (
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <SectionHeader
            title="Ready to rate"
            subtitle="Reviews stay sealed until both sides submit — NestBridge moderates before they appear"
          />

          {pendingReviews.length === 0 ? (
            <EmptyState
              title="Nothing to rate yet"
              body="After a confirmed stay or guide session ends, you can leave a star rating and short review here."
              tip="You can also open Past bookings and tap a completed trip to rate."
              iconGlyph="⭐"
            />
          ) : (
            pendingReviews.map((booking) => (
              <Pressable
                key={booking.id}
                style={({ pressed }) => [styles.rowPress, pressed && styles.pressed]}
                onPress={() => onRatePress?.(booking)}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${booking.hostName}`}
              >
                <Card style={styles.rowCard}>
                  <View style={styles.rowTop}>
                    <Text style={styles.hostName} numberOfLines={2}>
                      {booking.hostName}
                    </Text>
                    <StatusBadge
                      label={booking.bookingType === 'GUIDE' ? 'Guide' : 'Homestay'}
                      tone="info"
                    />
                  </View>
                  <Text style={styles.meta}>{bookingLine(booking)}</Text>
                  <Text style={styles.cta}>Tap to rate · 1–5 stars</Text>
                </Card>
              </Pressable>
            ))
          )}
        </ScreenScroll>
      )}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      gap: spacing.md,
      paddingBottom: spacing.xxl,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    loadingLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
    },
    rowPress: {
      minHeight: touchTarget,
    },
    rowCard: {
      gap: spacing.xs,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    hostName: {
      flex: 1,
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      lineHeight: lineHeights.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    cta: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      marginTop: spacing.xs,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}

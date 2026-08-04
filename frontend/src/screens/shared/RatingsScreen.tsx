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
import AppIcon from '../../components/AppIcon';
import type { BookingListItem } from '../../types/booking';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  iconSizes,
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
          <Card padding="md" elevation="card" style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <AppIcon name="star" size={iconSizes.lg} color={colors.gold} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Your review helps the next guest</Text>
              <Text style={styles.heroBody}>
                Reviews stay sealed until both sides submit. NestBridge moderates
                before anything appears publicly.
              </Text>
            </View>
          </Card>

          <SectionHeader
            title="Ready to rate"
            subtitle={
              pendingReviews.length > 0
                ? `${pendingReviews.length} completed ${pendingReviews.length === 1 ? 'booking' : 'bookings'} waiting for your stars`
                : 'Completed stays and guide sessions show up here'
            }
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
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{booking.hostInitials}</Text>
                  </View>
                  <View style={styles.rowBody}>
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
                    {booking.hostLocation ? (
                      <Text style={styles.location} numberOfLines={1}>
                        {booking.hostLocation}
                      </Text>
                    ) : null}
                    <View style={styles.ctaRow}>
                      <View style={styles.starsPreview}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <AppIcon
                            key={value}
                            name="star-outline"
                            size={iconSizes.sm}
                            color={colors.gold}
                          />
                        ))}
                      </View>
                      <Text style={styles.cta}>Tap to rate</Text>
                      <AppIcon
                        name="chevron-forward"
                        size={iconSizes.md}
                        color={colors.teal}
                      />
                    </View>
                  </View>
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
    heroCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      backgroundColor: colors.warmCream,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
    },
    heroIcon: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroText: {
      flex: 1,
      gap: spacing.xs,
    },
    heroTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      lineHeight: lineHeights.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    heroBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    rowPress: {
      minHeight: touchTarget,
    },
    rowCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    avatar: {
      width: touchTarget + spacing.sm,
      height: touchTarget + spacing.sm,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.navy,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.gold,
    },
    rowBody: {
      flex: 1,
      gap: spacing.xs,
      minWidth: 0,
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
    location: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xs,
      minHeight: touchTarget - spacing.md,
    },
    starsPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    cta: {
      flex: 1,
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import BackButton from '../../components/BackButton';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ListRow from '../../components/ListRow';
import ScreenScroll from '../../components/ScreenScroll';
import StatusBadge, { type StatusBadgeTone } from '../../components/StatusBadge';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  layout,
  lineHeights,
  shadows,
  touchTarget,
} from '../../constants/theme';
import ProfileIncompleteBanner from '../../components/ProfileIncompleteBanner';
import type { BookingListItem, BookingStatus, BookingTabFilter, BookingType } from '../../types/booking';
import { formatBookingDate, formatCurrency } from '../../data/bookingMock';
import { formatSessionSchedule } from '../../data/guideSessionMock';

export interface StudentBookingsScreenProps {
  bookings: BookingListItem[];
  activeFilter: BookingTabFilter;
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  showHostReviewEntry?: boolean;
  showGuideReviewEntry?: boolean;
  onGuideReviewPress?: () => void;
  onFilterChange?: (filter: BookingTabFilter) => void;
  onBookingPress?: (bookingId: string) => void;
  onPayPress?: (bookingId: string) => void;
  payBlocked?: boolean;
  payBlockedMessage?: string;
  onContinueSetupPay?: () => void;
  onTabPress?: (tabId: string) => void;
  onBack?: () => void;
  onHostReviewPress?: () => void;
}

const FILTERS: { id: BookingTabFilter; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'past', label: 'Past' },
];

function statusMeta(status: BookingStatus, bookingType: BookingType): {
  label: string;
  tone: StatusBadgeTone;
} {
  switch (status) {
    case 'PENDING_HOST':
      return {
        label: bookingType === 'GUIDE' ? 'Awaiting guide' : 'Awaiting host',
        tone: 'warning',
      };
    case 'ACCEPTED':
      return { label: 'Ready to pay', tone: 'info' };
    case 'CONFIRMED':
      return { label: 'Confirmed', tone: 'success' };
    case 'CHECKED_IN':
      return { label: 'Checked in', tone: 'success' };
    case 'DECLINED':
      return { label: 'Declined', tone: 'neutral' };
    case 'EXPIRED':
      return { label: 'Expired', tone: 'neutral' };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral' };
    default:
      return { label: status, tone: 'neutral' };
  }
}

function bookingTypeLabel(type: BookingType): string {
  return type === 'GUIDE' ? 'Guide session' : 'Homestay';
}

function bookingScheduleLine(booking: BookingListItem): string {
  if (booking.bookingType === 'GUIDE' && booking.session) {
    return formatSessionSchedule(
      booking.session.sessionDate,
      booking.session.sessionStartTime,
      booking.session.durationHours,
    );
  }
  return `${formatBookingDate(booking.checkIn)} – ${formatBookingDate(booking.checkOut)}`;
}

function bookingTotalLine(booking: BookingListItem): string {
  if (booking.bookingType === 'GUIDE' && booking.sessionPrice) {
    return formatCurrency(booking.sessionPrice.total, booking.sessionPrice.currency);
  }
  return formatCurrency(booking.priceBreakdown.total, booking.priceBreakdown.currency);
}

function filterBookings(
  bookings: BookingListItem[],
  filter: BookingTabFilter,
): BookingListItem[] {
  switch (filter) {
    case 'active':
      return bookings.filter((b) =>
        ['ACCEPTED', 'CONFIRMED', 'CHECKED_IN'].includes(b.status),
      );
    case 'pending':
      return bookings.filter((b) => b.status === 'PENDING_HOST');
    case 'past':
      return bookings.filter((b) =>
        ['DECLINED', 'EXPIRED', 'CANCELLED'].includes(b.status),
      );
    default:
      return bookings;
  }
}

export default function StudentBookingsScreen({
  bookings,
  activeFilter,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  showHostReviewEntry = false,
  showGuideReviewEntry = false,
  onFilterChange,
  onBookingPress,
  onPayPress,
  payBlocked = false,
  payBlockedMessage = 'Finish your Student or Tourist profile to complete payment.',
  onContinueSetupPay,
  onTabPress,
  onBack,
  onHostReviewPress,
  onGuideReviewPress,
}: StudentBookingsScreenProps) {
  const insets = useSafeAreaInsets();
  const filtered = filterBookings(bookings, activeFilter);
  const payNowBooking = bookings.find((b) => b.status === 'ACCEPTED');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerTop}>
          {onBack ? (
            <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <Text style={styles.headerTitle}>My bookings</Text>
          <View style={styles.backPlaceholder} />
        </View>
        <Text style={styles.headerSubtitle}>
          Track requests, payments, and confirmed stays
        </Text>
      </LinearGradient>

      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          {FILTERS.map((tab) => {
            const isActive = tab.id === activeFilter;
            return (
              <Pressable
                key={tab.id}
                style={[styles.segmentItem, isActive && styles.segmentItemActive]}
                onPress={() => onFilterChange?.(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScreenScroll
        withTabBar
        withSosDock={showSosDock}
        contentContainerStyle={styles.scrollContent}
      >
        {showGuideReviewEntry ? (
          <Card padding="none" style={styles.entryCard}>
            <ListRow
              title="Session requests"
              subtitle="Students and tourists who want to book a tour"
              iconName="map-outline"
              onPress={onGuideReviewPress ?? onHostReviewPress}
              bordered={false}
            />
          </Card>
        ) : null}

        {showHostReviewEntry ? (
          <Card padding="none" style={styles.entryCard}>
            <ListRow
              title="Incoming requests"
              subtitle="Review students who want to stay with you"
              iconName="home-outline"
              onPress={onHostReviewPress}
              bordered={false}
            />
          </Card>
        ) : null}

        {activeFilter === 'active' && payNowBooking ? (
          <>
            {payBlocked ? (
              <ProfileIncompleteBanner
                message={payBlockedMessage}
                onContinueSetup={onContinueSetupPay}
              />
            ) : null}
            <Pressable
              style={({ pressed }) => [styles.heroCard, pressed && !payBlocked && styles.pressed]}
              onPress={() => {
                if (!payBlocked) {
                  onPayPress?.(payNowBooking.id);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`Complete payment for ${payNowBooking.hostName}`}
              accessibilityState={{ disabled: payBlocked }}
            >
              <LinearGradient
                colors={[...gradients.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.heroGradient, payBlocked && styles.heroGradientDisabled]}
              >
                <Text style={styles.heroEyebrow}>Action needed</Text>
                <Text style={styles.heroTitle}>
                  Complete payment for {payNowBooking.hostName}
                </Text>
                <Text style={styles.heroDates}>
                  {bookingScheduleLine(payNowBooking)}
                </Text>
                <View style={styles.heroCta}>
                  <Text style={styles.heroCtaText}>Pay now</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </>
        ) : null}

        {filtered.length === 0 ? (
          <EmptyState
            iconName="clipboard-outline"
            title="Nothing here yet"
            body={
              activeFilter === 'pending'
                ? 'Send a request to a host — it will show here while they review it.'
                : activeFilter === 'past'
                  ? 'Completed stays and declined requests land here.'
                  : 'Confirmed stays and payment-ready bookings show up here.'
            }
            tip={
              activeFilter === 'active'
                ? 'Search hosts in Accra, Kumasi, or your campus city to get started.'
                : undefined
            }
          />
        ) : (
          filtered.map((booking, index) => {
            const meta = statusMeta(booking.status, booking.bookingType);
            const isLast = index === filtered.length - 1;
            return (
              <Pressable
                key={booking.id}
                style={({ pressed }) => [
                  !isLast && styles.bookingCardSpacing,
                  pressed && styles.pressed,
                ]}
                onPress={() => onBookingPress?.(booking.id)}
                accessibilityRole="button"
                accessibilityLabel={`${booking.hostName}, ${meta.label}`}
              >
                <Card style={styles.bookingCard}>
                  <Avatar
                    initials={booking.hostInitials}
                    size="lg"
                    style={styles.hostAvatar}
                  />

                  <View style={styles.bookingBody}>
                    <View style={styles.typeChipRow}>
                      <StatusBadge
                        label={bookingTypeLabel(booking.bookingType)}
                        tone="info"
                      />
                    </View>
                    <View style={styles.bookingTopRow}>
                      <Text style={styles.hostName} numberOfLines={1}>
                        {booking.hostName}
                      </Text>
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </View>

                    <Text style={styles.location} numberOfLines={1}>
                      {booking.hostLocation}
                    </Text>

                    <Text style={styles.dates}>{bookingScheduleLine(booking)}</Text>

                    <Text style={styles.total}>{bookingTotalLine(booking)}</Text>
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}
      </ScreenScroll>

      <AppTabBar
        items={tabBarItems}
        activeTabId={activeTabId}
        showSosDock={showSosDock}
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backButton: {
    marginLeft: -spacing.sm,
  },
  backPlaceholder: {
    width: touchTarget,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: lineHeights.heading,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  segmentWrap: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    ...shadows.card,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget,
    borderRadius: borderRadius.md,
  },
  segmentItemActive: {
    backgroundColor: colors.navy,
  },
  segmentLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  scrollContent: {
    paddingTop: 0,
  },
  entryCard: {
    marginBottom: layout.sectionGap,
  },
  heroCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: layout.sectionGap,
    ...shadows.raised,
  },
  heroGradient: {
    padding: layout.cardPaddingLarge,
  },
  heroGradientDisabled: {
    opacity: 0.55,
  },
  heroEyebrow: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.sm,
  },
  heroDates: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.92,
    marginBottom: spacing.md,
    lineHeight: lineHeights.body,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    minHeight: touchTarget,
  },
  heroCtaText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookingCardSpacing: {
    marginBottom: spacing.md,
  },
  hostAvatar: {
    marginRight: spacing.md,
  },
  bookingBody: {
    flex: 1,
  },
  typeChipRow: {
    marginBottom: spacing.sm,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  hostName: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  location: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.caption,
  },
  dates: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.body,
  },
  total: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import AppIcon from '../../components/AppIcon';
import BackButton from '../../components/BackButton';
import EmptyState from '../../components/EmptyState';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
  lineHeights,
  shadows,
  tints,
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
  bg: string;
  text: string;
} {
  switch (status) {
    case 'PENDING_HOST':
      return {
        label: bookingType === 'GUIDE' ? 'Awaiting guide' : 'Awaiting host',
        bg: colors.warmCream,
        text: colors.warning,
      };
    case 'ACCEPTED':
      return { label: 'Ready to pay', bg: colors.teal, text: colors.white };
    case 'CONFIRMED':
      return { label: 'Confirmed', bg: colors.success, text: colors.white };
    case 'CHECKED_IN':
      return { label: 'Checked in', bg: colors.success, text: colors.white };
    case 'DECLINED':
      return { label: 'Declined', bg: colors.border, text: colors.textSecondary };
    case 'EXPIRED':
      return { label: 'Expired', bg: colors.border, text: colors.textSecondary };
    case 'CANCELLED':
      return { label: 'Cancelled', bg: colors.border, text: colors.textSecondary };
    default:
      return { label: status, bg: colors.border, text: colors.textSecondary };
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + layout.scrollBottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {showGuideReviewEntry ? (
          <Pressable
            style={({ pressed }) => [styles.hostEntryCard, pressed && styles.pressed]}
            onPress={onGuideReviewPress ?? onHostReviewPress}
            accessibilityRole="button"
            accessibilityLabel="Review incoming session requests"
          >
            <View style={styles.hostEntryIconWrap}>
              <AppIcon name="map-outline" size={fontSizes.subheading} color={colors.tealDeep} />
            </View>
            <View style={styles.hostEntryText}>
              <Text style={styles.hostEntryTitle}>Session requests</Text>
              <Text style={styles.hostEntrySubtitle}>
                Students and tourists who want to book a tour
              </Text>
            </View>
            <Text style={styles.hostEntryAction}>Review</Text>
            <AppIcon name="chevron-forward" size={fontSizes.body} color={colors.teal} />
          </Pressable>
        ) : null}

        {showHostReviewEntry ? (
          <Pressable
            style={({ pressed }) => [styles.hostEntryCard, pressed && styles.pressed]}
            onPress={onHostReviewPress}
            accessibilityRole="button"
            accessibilityLabel="Review incoming booking requests"
          >
            <View style={styles.hostEntryIconWrap}>
              <AppIcon name="home-outline" size={fontSizes.subheading} color={colors.tealDeep} />
            </View>
            <View style={styles.hostEntryText}>
              <Text style={styles.hostEntryTitle}>Incoming requests</Text>
              <Text style={styles.hostEntrySubtitle}>
                Review students who want to stay with you
              </Text>
            </View>
            <Text style={styles.hostEntryAction}>Review</Text>
            <AppIcon name="chevron-forward" size={fontSizes.body} color={colors.teal} />
          </Pressable>
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
                  styles.bookingCard,
                  !isLast && styles.bookingCardSpacing,
                  pressed && styles.pressed,
                ]}
                onPress={() => onBookingPress?.(booking.id)}
                accessibilityRole="button"
                accessibilityLabel={`${booking.hostName}, ${meta.label}`}
              >
                <View style={styles.hostAvatar}>
                  <Text style={styles.hostAvatarText}>{booking.hostInitials}</Text>
                </View>

                <View style={styles.bookingBody}>
                  <View style={styles.typeChipRow}>
                    <View style={styles.typeChip}>
                      <Text style={styles.typeChipText}>
                        {bookingTypeLabel(booking.bookingType)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bookingTopRow}>
                    <Text style={styles.hostName} numberOfLines={1}>
                      {booking.hostName}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.statusText, { color: meta.text }]}>
                        {meta.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.location} numberOfLines={1}>
                    {booking.hostLocation}
                  </Text>

                  <Text style={styles.dates}>{bookingScheduleLine(booking)}</Text>

                  <Text style={styles.total}>{bookingTotalLine(booking)}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

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
    paddingHorizontal: spacing.lg,
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
    width: 44,
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
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  hostEntryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.card,
  },
  hostEntryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: tints.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostEntryAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  hostEntryText: {
    flex: 1,
  },
  hostEntryTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: lineHeights.subheading,
  },
  hostEntrySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  heroCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.raised,
  },
  heroGradient: {
    padding: spacing.lg,
  },
  heroGradientDisabled: {
    opacity: 0.55,
  },
  heroEyebrow: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
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
    minHeight: 44,
  },
  heroCtaText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  bookingCardSpacing: {
    marginBottom: spacing.md,
  },
  hostAvatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hostAvatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  bookingBody: {
    flex: 1,
  },
  typeChipRow: {
    marginBottom: spacing.sm,
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
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
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  statusText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
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

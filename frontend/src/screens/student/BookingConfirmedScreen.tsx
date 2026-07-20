import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  motion,
  lineHeights,
  shadows,
  layout,
  iconSizes,
  avatarSizes,
} from '../../constants/theme';
import { formatBookingDate, formatCurrency } from '../../data/bookingMock';

export interface BookingConfirmedScreenProps {
  hostName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  currency: string;
  onViewBookings?: () => void;
}

export default function BookingConfirmedScreen({
  hostName,
  checkIn,
  checkOut,
  totalAmount,
  currency,
  onViewBookings,
}: BookingConfirmedScreenProps) {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: motion.durationNormal,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const iconScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const textOpacity = entrance;
  const textTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [spacing.md, 0],
  });

  return (
    <LinearGradient
      colors={[...gradients.header]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconCircle,
            {
              opacity: textOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <AppIcon name="checkmark" size={iconSizes.xl} color={colors.white} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={styles.title}>You're all booked!</Text>
          <Text style={styles.subtitle}>
            Your stay with {hostName} is confirmed. We've shared the details with
            your host family so they can welcome you.
          </Text>

          <Card padding="lg" elevation="card" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Host</Text>
              <Text style={styles.summaryValue}>{hostName}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dates</Text>
              <Text style={styles.summaryValue}>
                {formatBookingDate(checkIn)} – {formatBookingDate(checkOut)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Paid</Text>
              <Text style={[styles.summaryValue, styles.summaryHighlight]}>
                {formatCurrency(totalAmount, currency)}
              </Text>
            </View>
          </Card>
        </Animated.View>
      </View>

      <PrimaryButton label="View my bookings" onPress={onViewBookings} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: avatarSizes.xl + spacing.md,
    height: avatarSizes.xl + spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: spacing.xs,
    borderColor: colors.white,
    ...shadows.raised,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: lineHeights.display,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.92,
    textAlign: 'center',
    lineHeight: lineHeights.subheading,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  summaryCard: {
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  summaryHighlight: {
    fontFamily: fontFamilies.semibold,
    color: colors.tealDeep,
    fontWeight: fontWeights.semibold,
  },
  summaryDivider: {
    height: borderWidths.hairline,
    backgroundColor: colors.border,
  },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  motion,
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
          <Text style={styles.checkIcon}>✓</Text>
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
            Your stay with {hostName} is confirmed. We've sent the details to your
            host family.
          </Text>

          <View style={styles.summaryCard}>
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
          </View>
        </Animated.View>
      </View>

      <PrimaryButton label="View my bookings" onPress={onViewBookings} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tealBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 4,
    borderColor: colors.white,
  },
  checkIcon: {
    fontSize: 40,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  title: {
    fontSize: fontSizes.display + 4,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: fontSizes.subheading,
    color: colors.white,
    opacity: 0.92,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  summaryHighlight: {
    color: colors.tealDeep,
    fontWeight: fontWeights.bold,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

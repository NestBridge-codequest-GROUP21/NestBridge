import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
} from '../../constants/theme';
import type { LodgingListing } from '../../types/lodging';
import { lodgingCategoryLabel } from '../../data/lodgingDirectoryMock';

export interface LodgingDetailScreenProps {
  listing: LodgingListing;
  isSaved?: boolean;
  onSaveContact?: () => void;
  onBack?: () => void;
}

export default function LodgingDetailScreen({
  listing,
  isSaved = false,
  onSaveContact,
  onBack,
}: LodgingDetailScreenProps) {
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    if (listing.phone) {
      Linking.openURL(`tel:${listing.phone.replace(/\s/g, '')}`);
    }
  };

  const handleEmail = () => {
    if (listing.email) {
      Linking.openURL(`mailto:${listing.email}`);
    }
  };

  const handleBookWeb = () => {
    if (listing.bookingUrl) {
      Linking.openURL(listing.bookingUrl);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.header]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
        </Pressable>

        <View style={styles.heroContent}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroInitials}>
              {listing.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.meta}>
            {lodgingCategoryLabel(listing.category)} · {listing.area}, {listing.city}
          </Text>
          <View style={styles.ratingRow}>
            <AppIcon name="star" size={fontSizes.body} color={colors.gold} />
            <Text style={styles.rating}>{listing.rating}</Text>
            <Text style={styles.price}>{listing.priceHint}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 200 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Booking happens on the provider site or by phone — not inside NestBridge.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{listing.description}</Text>

        {listing.phone ? (
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{listing.phone}</Text>
          </View>
        ) : null}

        {listing.email ? (
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{listing.email}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        {listing.bookingUrl ? (
          <PrimaryButton label="Book on website" onPress={handleBookWeb} />
        ) : null}
        <View style={styles.actionRow}>
          {listing.phone ? (
            <View style={styles.actionHalf}>
              <SecondaryButton label="Call" onPress={handleCall} />
            </View>
          ) : null}
          {listing.email ? (
            <View style={styles.actionHalf}>
              <SecondaryButton label="Email" onPress={handleEmail} />
            </View>
          ) : null}
        </View>
        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          onPress={onSaveContact}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Saved to contacts' : 'Save to My contacts'}
        >
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Saved to My contacts' : 'Save to My contacts'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroInitials: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  name: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  rating: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.gold,
  },
  price: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.92,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  disclaimer: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclaimerText: {
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  contactRow: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactLabel: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionHalf: {
    flex: 1,
  },
  saveButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  pressed: {
    opacity: 0.85,
  },
});

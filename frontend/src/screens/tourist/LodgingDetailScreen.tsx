import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Avatar from '../../components/Avatar';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import ScreenScroll from '../../components/ScreenScroll';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  lineHeights,
  shadows,
  layout,
  iconSizes,
  touchTarget,
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
        <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />

        <View style={styles.heroContent}>
          <View style={styles.heroAvatarWrap}>
            <Avatar initials={listing.name.slice(0, 2)} size="xl" />
          </View>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.meta}>
            {lodgingCategoryLabel(listing.category)} · {listing.area}, {listing.city}
          </Text>
          <View style={styles.ratingRow}>
            <AppIcon name="star" size={iconSizes.md} color={colors.gold} />
            <Text style={styles.rating}>{listing.rating}</Text>
            <Text style={styles.price}>{listing.priceHint}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + layout.scrollBottomInsetWithSos,
        }}
      >
        <InlineBanner
          tone="info"
          message="Book on the provider’s site or by phone — not inside NestBridge."
        />

        <Card padding="lg" elevation="card" style={styles.detailCard}>
          <SectionHeader title="About" style={styles.aboutHeader} />
          <Text style={styles.description}>{listing.description}</Text>

          {listing.phone || listing.email ? (
            <View style={styles.contactBlock}>
              {listing.phone ? (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{listing.phone}</Text>
                </View>
              ) : null}
              {listing.email ? (
                <View
                  style={[
                    styles.contactRow,
                    listing.phone ? styles.contactRowBorder : null,
                  ]}
                >
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{listing.email}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Card>
      </ScreenScroll>

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
          <AppIcon
            name={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
            size={iconSizes.md}
            color={colors.teal}
          />
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroAvatarWrap: {
    marginBottom: spacing.md,
    ...shadows.card,
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.heading,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  meta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  rating: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.gold,
  },
  price: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.92,
  },
  detailCard: {
    marginBottom: spacing.md,
  },
  aboutHeader: {
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  contactBlock: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  contactRow: {
    paddingVertical: spacing.sm,
  },
  contactRowBorder: {
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  contactLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
    gap: spacing.sm,
    ...shadows.raised,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionHalf: {
    flex: 1,
  },
  saveButton: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  pressed: {
    opacity: 0.85,
  },
});

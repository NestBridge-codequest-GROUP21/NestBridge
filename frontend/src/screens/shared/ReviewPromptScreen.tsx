import React, { useState } from 'react';
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
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import FormTextField from '../../components/FormTextField';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  iconSizes,
  touchTarget,
  gradients,
  layout,
  lineHeights,
  shadows,
} from '../../constants/theme';
import { reviewPromptCopy } from '../../data/welfareMock';

export interface ReviewPromptScreenProps {
  hostName: string;
  onSubmit?: (rating: number, comment: string) => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function ReviewPromptScreen({
  hostName,
  onSubmit,
  onSkip,
  onBack,
}: ReviewPromptScreenProps) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />
        <Text style={styles.headerTitle}>{reviewPromptCopy.title}</Text>
        <Text style={styles.headerSubtitle}>
          {hostName} · {reviewPromptCopy.subtitle}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl * 3 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>{reviewPromptCopy.ratingLabel}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((value) => {
            const filled = value <= rating;
            return (
              <Pressable
                key={value}
                style={styles.starButton}
                onPress={() => setRating(value)}
                accessibilityRole="button"
                accessibilityLabel={`${value} stars`}
              >
                <AppIcon
                  name={filled ? 'star' : 'star-outline'}
                  size={iconSizes.xl}
                  color={filled ? colors.gold : colors.border}
                />
              </Pressable>
            );
          })}
        </View>

        <FormTextField
          label="Comments"
          value={comment}
          onChangeText={setComment}
          placeholder={reviewPromptCopy.commentPlaceholder}
          multiline
          numberOfLines={4}
        />

        <Card style={styles.sealedCard} padding="lg">
          <Text style={styles.sealedTitle}>Sealed review</Text>
          <Text style={styles.sealedBody}>
            Your rating stays hidden until your host submits their feedback too.
            NestBridge moderates reviews before they appear on profiles.
          </Text>
        </Card>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <PrimaryButton
          label={reviewPromptCopy.submitLabel}
          onPress={() => onSubmit?.(rating, comment)}
          disabled={rating === 0}
        />
        <View style={styles.skipSpacer} />
        <SecondaryButton label={reviewPromptCopy.skipLabel} onPress={onSkip ?? onBack} />
      </View>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.heading,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  body: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  bodyContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  starButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealedCard: {
    backgroundColor: colors.warmCream,
  },
  sealedTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sealedBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
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
    ...shadows.raised,
  },
  skipSpacer: {
    height: spacing.sm,
  },
});

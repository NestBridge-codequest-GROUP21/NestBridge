import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
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
  layout,
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
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
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
                  size={fontSizes.display}
                  color={filled ? colors.gold : colors.border}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Comments</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder={reviewPromptCopy.commentPlaceholder}
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.sealedCard}>
          <Text style={styles.sealedTitle}>Sealed review</Text>
          <Text style={styles.sealedBody}>
            Your rating stays hidden until your host submits their feedback too.
            NestBridge moderates reviews before they appear on profiles.
          </Text>
        </View>
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
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: 22,
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
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
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
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 32,
    color: colors.border,
  },
  starFilled: {
    color: colors.warning,
  },
  commentInput: {
    minHeight: 120,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  sealedCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sealedTitle: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sealedBody: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
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
  },
  skipSpacer: {
    height: spacing.sm,
  },
});

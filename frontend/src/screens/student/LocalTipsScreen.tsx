import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import EmptyState from '../../components/EmptyState';
import type {
  CulturalPhraseCard,
  CulturalTopicCard,
} from '../../data/featureScreensMock';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
} from '../../constants/theme';

export interface LocalTipsScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  phrases: CulturalPhraseCard[];
  topics: CulturalTopicCard[];
  onPlayAudio?: (phraseId: string) => void;
  onTopicPress?: (topicId: string) => void;
  onBack?: () => void;
}

function PhraseCard({
  phrase,
  onPlayAudio,
}: {
  phrase: CulturalPhraseCard;
  onPlayAudio?: () => void;
}) {
  return (
    <View style={styles.phraseCard}>
      <View style={styles.iconTile}>
        <AppIcon glyph={phrase.emoji} size={26} color={colors.tealDeep} />
      </View>
      <Text style={styles.phraseText}>{phrase.phrase}</Text>
      <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
      {phrase.hasAudio && onPlayAudio ? (
        <Pressable
          style={styles.audioButton}
          onPress={onPlayAudio}
          accessibilityRole="button"
          accessibilityLabel={`Play audio for ${phrase.phrase}`}
        >
          <AppIcon name="volume-high-outline" size={fontSizes.body} color={colors.teal} />
          <Text style={styles.audioLabel}>Hear it</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function TopicCard({ topic }: { topic: CulturalTopicCard }) {
  return (
    <View
      style={styles.topicCard}
      accessibilityRole="text"
      accessibilityLabel={`${topic.title}. ${topic.description}`}
    >
      <View style={styles.topicHeader}>
        <View style={styles.iconTileCompact}>
          <AppIcon glyph={topic.emoji} size={22} color={colors.tealDeep} />
        </View>
        <Text style={styles.topicTitle}>{topic.title}</Text>
      </View>
      <Text style={styles.topicDescription}>{topic.description}</Text>
    </View>
  );
}

export default function LocalTipsScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  phrases,
  topics,
  onPlayAudio,
  onBack,
}: LocalTipsScreenProps) {
  const isEmpty = phrases.length === 0 && topics.length === 0;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <Text style={styles.screenTitle}>Ghana culture & language</Text>
        <Text style={styles.screenSubtitle}>
          Everyday phrases and local customs that help you settle in with confidence.
        </Text>

        {isEmpty ? (
          <EmptyState
            iconName="globe-outline"
            title="No tips for this city yet"
            body="Ghana culture notes and phrases will show here once they are available for your destination."
            tip="Accra tips are ready — set Accra as your city in account setup if that is where you are headed."
          />
        ) : (
          <>
            {phrases.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>Useful phrases</Text>
                <View style={styles.grid}>
                  {phrases.map((phrase) => (
                    <PhraseCard
                      key={phrase.id}
                      phrase={phrase}
                      onPlayAudio={() => onPlayAudio?.(phrase.id)}
                    />
                  ))}
                </View>
              </>
            ) : null}
            {topics.length > 0 ? (
              <>
                <Text style={[styles.sectionLabel, styles.sectionSpacer]}>
                  Settling into Ghana
                </Text>
                <View style={styles.topicList}>
                  {topics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </View>
              </>
            ) : null}
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.sm,
  },
  screenSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  sectionSpacer: {
    marginTop: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  topicList: {
    gap: spacing.md,
  },
  phraseCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.card,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  iconTileCompact: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: lineHeights.subheading,
  },
  phraseTranslation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: lineHeights.caption,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  audioLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  topicCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  topicTitle: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  topicDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
});

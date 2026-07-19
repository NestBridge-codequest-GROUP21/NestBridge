import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
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
          <Text style={styles.audioLabel}>Audio</Text>
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
      <View style={styles.iconTile}>
        <AppIcon glyph={topic.emoji} size={26} color={colors.tealDeep} />
      </View>
      <Text style={styles.topicTitle}>{topic.title}</Text>
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
  onTopicPress,
  onBack,
}: LocalTipsScreenProps) {
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
        <Text style={styles.screenTitle}>Cultural & Language Guide</Text>

        <View style={styles.grid}>
          {phrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              onPlayAudio={() => onPlayAudio?.(phrase.id)}
            />
          ))}
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </View>
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
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  phraseText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  phraseTranslation: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
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
    color: colors.teal,
  },
  topicCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 140,
  },
  topicTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  topicDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

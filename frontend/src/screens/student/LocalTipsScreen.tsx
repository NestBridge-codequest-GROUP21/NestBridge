import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import type {
  CulturalPhraseCard,
  CulturalTopicCard,
} from '../../data/featureScreensMock';
import {
  colors,
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
      <Text style={styles.phraseEmoji}>{phrase.emoji}</Text>
      <Text style={styles.phraseText}>{phrase.phrase}</Text>
      <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
      {phrase.hasAudio ? (
        <Pressable
          style={styles.audioButton}
          onPress={onPlayAudio}
          accessibilityRole="button"
          accessibilityLabel={`Play audio for ${phrase.phrase}`}
        >
          <Text style={styles.audioIcon}>🔊</Text>
          <Text style={styles.audioLabel}>Audio</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function TopicCard({
  topic,
  onPress,
}: {
  topic: CulturalTopicCard;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.topicCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={topic.title}
    >
      <Text style={styles.topicEmoji}>{topic.emoji}</Text>
      <Text style={styles.topicTitle}>{topic.title}</Text>
      <Text style={styles.topicDescription}>{topic.description}</Text>
    </Pressable>
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
            <TopicCard
              key={topic.id}
              topic={topic}
              onPress={() => onTopicPress?.(topic.id)}
            />
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
  phraseEmoji: {
    fontSize: fontSizes.display,
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
  audioIcon: {
    fontSize: fontSizes.body,
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
  topicEmoji: {
    fontSize: fontSizes.heading,
    marginBottom: spacing.sm,
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

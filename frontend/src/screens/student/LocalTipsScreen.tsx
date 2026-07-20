import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import SectionHeader from '../../components/SectionHeader';
import type {
  CulturalPhraseCard,
  CulturalTopicCard,
} from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  iconSizes,
  avatarSizes,
  touchTarget,
  layout,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

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
  onEmptyPrimaryAction?: () => void;
  onBack?: () => void;
}

function PhraseCard({
  phrase,
  onPlayAudio,
}: {
  phrase: CulturalPhraseCard;
  onPlayAudio?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPlayAudio}
      accessibilityRole="button"
      accessibilityLabel={`${phrase.phrase}. ${phrase.translation}`}
    >
      <Card style={styles.phraseCard} padding="md">
        <View style={styles.iconTile}>
          <AppIcon glyph={phrase.emoji} size={iconSizes.lg} color={colors.tealDeep} />
        </View>
        <Text style={styles.phraseText}>{phrase.phrase}</Text>
        <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
        {phrase.hasAudio ? (
          <View style={styles.audioButton}>
            <AppIcon name="volume-high-outline" size={iconSizes.md} color={colors.teal} />
            <Text style={styles.audioLabel}>Hear it</Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

function TopicCard({
  topic,
  onPress,
}: {
  topic: CulturalTopicCard;
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${topic.title}. ${topic.description}`}
    >
      <Card style={styles.topicCard} padding="md">
        <View style={styles.topicHeader}>
          <View style={styles.iconTileCompact}>
            <AppIcon glyph={topic.emoji} size={iconSizes.md} color={colors.tealDeep} />
          </View>
          <Text style={styles.topicTitle}>{topic.title}</Text>
        </View>
        <Text style={styles.topicDescription}>{topic.description}</Text>
      </Card>
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
  onEmptyPrimaryAction,
  onBack,
}: LocalTipsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.localTips;

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
        <SectionHeader
          title="Ghana culture & language"
          subtitle="Everyday phrases and local customs that help you settle in with confidence."
        />

        {isEmpty ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : (
          <>
            {phrases.length > 0 ? (
              <>
                <SectionHeader title="Useful phrases" style={styles.sectionTight} />
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
                <SectionHeader
                  title="Settling into Ghana"
                  style={styles.sectionSpacer}
                />
                <View style={styles.topicList}>
                  {topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onPress={() => onTopicPress?.(topic.id)}
                    />
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

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionTight: {
    marginBottom: spacing.sm,
  },
  sectionSpacer: {
    marginTop: layout.sectionGap,
    marginBottom: spacing.sm,
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
    alignItems: 'center',
  },
  iconTile: {
    width: avatarSizes.lg,
    height: avatarSizes.lg,
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
    width: avatarSizes.md,
    height: avatarSizes.md,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
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
    minHeight: touchTarget,
  },
  audioLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  topicCard: {
    width: '100%',
  },
  topicTitle: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
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
}


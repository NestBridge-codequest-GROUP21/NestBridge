import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import SectionHeader from '../../components/SectionHeader';
import ProgressBar from '../../components/ProgressBar';
import type {
  CulturalPhraseCard,
  PhraseGuideSection,
  TopicGuideSection,
} from '../../data/cultureLanguageGuide';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  avatarSizes,
  layout,
  touchTarget,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

export interface LocalTipsScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  phraseSections: PhraseGuideSection[];
  topicSections: TopicGuideSection[];
  completedPhraseIds?: string[];
  practicedPhraseIds?: string[];
  completedTopicIds?: string[];
  progressPercent?: number;
  progressLabel?: string;
  /** Prefer phrases (language) or topics (culture) at the top. */
  focus?: 'culture' | 'language';
  onPhrasePress?: (phraseId: string) => void;
  onPhrasePracticePress?: (phraseId: string) => void;
  onTopicPress?: (topicId: string) => void;
  onEmptyPrimaryAction?: () => void;
  onBack?: () => void;
}

function PhraseCard({
  phrase,
  cardWidth,
  completed,
  practiced,
  onPress,
  onPracticePress,
}: {
  phrase: CulturalPhraseCard;
  cardWidth: number;
  completed: boolean;
  practiced: boolean;
  onPress?: () => void;
  onPracticePress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.phrasePressable, { width: cardWidth }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ checked: completed }}
      accessibilityLabel={`${phrase.phrase}. ${phrase.translation}`}
    >
      <Card
        style={[styles.phraseCard, completed && styles.phraseCardDone]}
        padding="md"
      >
        <View style={styles.phraseTopRow}>
          <View style={styles.iconTile}>
            <AppIcon glyph={phrase.emoji} size={iconSizes.lg} color={colors.tealDeep} />
          </View>
          {completed ? (
            <AppIcon name="checkmark-circle-outline" size={iconSizes.md} color={colors.success} />
          ) : null}
        </View>
        <Text style={styles.phraseText}>{phrase.phrase}</Text>
        <Text style={styles.pronunciation} numberOfLines={2}>
          {phrase.pronunciation}
        </Text>
        <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
        {phrase.hasAudio ? (
          <Pressable
            style={({ pressed }) => [
              styles.audioButton,
              practiced && styles.audioButtonPracticed,
              pressed && styles.pressed,
            ]}
            onPress={() => onPracticePress?.()}
            accessibilityRole="button"
            accessibilityLabel={`Practice pronunciation of ${phrase.phrase}`}
          >
            <AppIcon
              name={practiced ? 'volume-high-outline' : 'volume-low-outline'}
              size={iconSizes.sm}
              color={colors.teal}
            />
            <Text style={styles.audioButtonLabel}>
              {practiced ? 'Practiced' : 'Hear / practice'}
            </Text>
          </Pressable>
        ) : null}
      </Card>
    </Pressable>
  );
}

function TopicCard({
  topic,
  completed,
  onPress,
}: {
  topic: TopicGuideSection['topics'][number];
  completed: boolean;
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ checked: completed }}
      accessibilityLabel={`${topic.title}. ${topic.description}`}
    >
      <Card
        style={[styles.topicCard, completed && styles.topicCardDone]}
        padding="md"
      >
        <View style={styles.topicHeader}>
          <View style={styles.iconTileCompact}>
            <AppIcon glyph={topic.emoji} size={iconSizes.md} color={colors.tealDeep} />
          </View>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          {completed ? (
            <AppIcon name="checkmark-circle-outline" size={iconSizes.md} color={colors.success} />
          ) : null}
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
  phraseSections,
  topicSections,
  completedPhraseIds = [],
  practicedPhraseIds = [],
  completedTopicIds = [],
  progressPercent = 0,
  progressLabel,
  focus,
  onPhrasePress,
  onPhrasePracticePress,
  onTopicPress,
  onEmptyPrimaryAction,
  onBack,
}: LocalTipsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const empty = emptyStates.localTips;
  const contentWidth = windowWidth - layout.screenPaddingHorizontal * 2;
  const phraseCardWidth = Math.floor((contentWidth - spacing.md) / 2);

  const completedPhraseSet = new Set(completedPhraseIds);
  const practicedPhraseSet = new Set(practicedPhraseIds);
  const completedTopicSet = new Set(completedTopicIds);

  const isEmpty = phraseSections.length === 0 && topicSections.length === 0;
  const showPhrasesFirst = focus !== 'culture';

  const phrasesBlock =
    phraseSections.length > 0 ? (
      <View style={showPhrasesFirst ? undefined : styles.blockSpacer}>
        {phraseSections.map((section, sectionIndex) => (
          <View key={section.id} style={sectionIndex > 0 ? styles.sectionBlock : undefined}>
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              style={styles.sectionTight}
            />
            <View style={styles.grid}>
              {section.phrases.map((item) => (
                <PhraseCard
                  key={item.id}
                  phrase={item}
                  cardWidth={phraseCardWidth}
                  completed={completedPhraseSet.has(item.id)}
                  practiced={practicedPhraseSet.has(item.id)}
                  onPress={() => onPhrasePress?.(item.id)}
                  onPracticePress={() => onPhrasePracticePress?.(item.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    ) : null;

  const topicsBlock =
    topicSections.length > 0 ? (
      <View style={showPhrasesFirst ? styles.blockSpacer : undefined}>
        {topicSections.map((section, sectionIndex) => (
          <View key={section.id} style={sectionIndex > 0 ? styles.sectionBlock : undefined}>
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              style={styles.sectionTight}
            />
            <View style={styles.topicList}>
              {section.topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  completed={completedTopicSet.has(topic.id)}
                  onPress={() => onTopicPress?.(topic.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    ) : null;

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
          subtitle="Communication, etiquette, and customs that help foreigners feel at home — practical living tips live under Local tips."
        />

        {!isEmpty ? (
          <Card padding="md" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Your learning progress</Text>
            <Text style={styles.progressMeta}>
              {progressLabel ??
                `${progressPercent}% complete · tap phrases and topics as you learn`}
            </Text>
            <ProgressBar
              percent={progressPercent}
              height={8}
              fillColor={colors.tealBright}
              style={styles.progressBar}
            />
          </Card>
        ) : null}

        {isEmpty ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : showPhrasesFirst ? (
          <>
            {phrasesBlock}
            {topicsBlock}
          </>
        ) : (
          <>
            {topicsBlock}
            {phrasesBlock}
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
    progressCard: {
      marginBottom: layout.sectionGap,
    },
    progressTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    progressMeta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
      marginBottom: spacing.sm,
    },
    progressBar: {
      marginTop: spacing.xs,
    },
    sectionTight: {
      marginBottom: spacing.sm,
    },
    sectionBlock: {
      marginTop: layout.sectionGap,
    },
    blockSpacer: {
      marginTop: layout.sectionGap,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    topicList: {
      gap: spacing.md,
    },
    phrasePressable: {
      // Explicit pixel width from parent — avoids % width collapsing inside Pressable.
    },
    phraseCard: {
      width: '100%',
      alignItems: 'center',
    },
    phraseCardDone: {
      borderWidth: borderWidths.strong,
      borderColor: colors.success,
    },
    phraseTopRow: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    iconTile: {
      width: avatarSizes.lg,
      height: avatarSizes.lg,
      borderRadius: borderRadius.md,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
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
      alignSelf: 'stretch',
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
      lineHeight: lineHeights.subheading,
    },
    pronunciation: {
      alignSelf: 'stretch',
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.teal,
      marginTop: spacing.xs,
      textAlign: 'center',
      lineHeight: lineHeights.caption,
    },
    phraseTranslation: {
      alignSelf: 'stretch',
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
      lineHeight: lineHeights.caption,
    },
    audioButton: {
      marginTop: spacing.sm,
      minHeight: touchTarget,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: tints.teal,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    audioButtonPracticed: {
      borderColor: colors.teal,
    },
    audioButtonLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    pressed: {
      opacity: 0.92,
    },
    topicCard: {
      width: '100%',
    },
    topicCardDone: {
      borderWidth: borderWidths.strong,
      borderColor: colors.success,
    },
    topicTitle: {
      flex: 1,
      flexShrink: 1,
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

import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import PrimaryButton from '../../components/PrimaryButton';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import type { CommunityMemberApi } from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
} from '../../constants/theme';

export interface StudentPublicProfileScreenProps {
  student: CommunityMemberApi | null;
  loading?: boolean;
  errorMessage?: string | null;
  messageBlocked?: boolean;
  messageBlockedHint?: string;
  onBack?: () => void;
  onMessagePress?: () => void;
  onRetry?: () => void;
}

export default function StudentPublicProfileScreen({
  student,
  loading = false,
  errorMessage,
  messageBlocked = false,
  messageBlockedHint,
  onBack,
  onMessagePress,
  onRetry,
}: StudentPublicProfileScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Student profile"
        subtitle="Fellow international student"
        compact
        onBack={onBack}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      ) : errorMessage || !student ? (
        <View style={styles.centered}>
          <EmptyState
            title="Profile unavailable"
            body={errorMessage || 'This student profile could not be loaded.'}
            tip="Go back and try another profile."
            iconGlyph="👤"
            primaryActionLabel={onRetry ? 'Retry' : undefined}
            onPrimaryAction={onRetry}
          />
        </View>
      ) : (
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <Card padding="lg" style={styles.heroCard}>
            <Avatar initials={student.initials} size="lg" />
            <View style={styles.heroText}>
              <Text style={styles.name}>{student.fullName}</Text>
              <Text style={styles.meta}>
                {[student.university, student.city, student.nationality]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
              {student.identityVerified ? (
                <StatusBadge label="Staff verified" tone="success" />
              ) : null}
            </View>
          </Card>

          {student.bio ? (
            <Card padding="lg" style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Bio</Text>
              <Text style={styles.sectionBody}>{student.bio}</Text>
            </Card>
          ) : null}

          {student.about ? (
            <Card padding="lg" style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>About</Text>
              <Text style={styles.sectionBody}>{student.about}</Text>
            </Card>
          ) : null}

          {messageBlocked ? (
            <Text style={styles.blockedHint}>
              {messageBlockedHint ||
                'NestBridge staff must verify your identity before messaging.'}
            </Text>
          ) : null}

          <PrimaryButton
            label="Message"
            onPress={onMessagePress}
            disabled={messageBlocked}
          />
        </ScreenScroll>
      )}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      gap: spacing.md,
      paddingBottom: spacing.xxl,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    heroCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    heroText: {
      flex: 1,
      gap: spacing.xs,
      minWidth: 0,
    },
    name: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
    },
    sectionCard: {
      gap: spacing.sm,
    },
    sectionLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textTertiary,
      textTransform: 'uppercase',
    },
    sectionBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textPrimary,
    },
    blockedHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
  });
}

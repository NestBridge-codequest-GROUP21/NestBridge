import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import type {
  CommunityHostApi,
  CommunityMemberApi,
} from '../../services/api';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  touchTarget,
} from '../../constants/theme';

type TabId = 'students' | 'hosts';

export interface NearbyCommunityScreenProps {
  cityLabel: string;
  students: CommunityMemberApi[];
  hosts: CommunityHostApi[];
  loading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onStudentPress?: (userId: string) => void;
  onHostPress?: (hostId: string) => void;
  onRetry?: () => void;
}

export default function NearbyCommunityScreen({
  cityLabel,
  students,
  hosts,
  loading = false,
  errorMessage,
  onBack,
  onStudentPress,
  onHostPress,
  onRetry,
}: NearbyCommunityScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [tab, setTab] = useState<TabId>('students');

  const place = cityLabel.trim() || 'your area';

  const tabs = useMemo(
    () =>
      [
        { id: 'students' as const, label: `Students (${students.length})` },
        { id: 'hosts' as const, label: `Host families (${hosts.length})` },
      ] as const,
    [students.length, hosts.length],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        title="People nearby"
        subtitle={`International students and host families in ${place}`}
        compact
        onBack={onBack}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingLabel}>Finding people near you…</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <EmptyState
            title="Could not load community"
            body={errorMessage}
            tip="Pull to try again once your connection is stable."
            iconGlyph="👥"
            primaryActionLabel="Retry"
            onPrimaryAction={onRetry}
          />
        </View>
      ) : (
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <Card padding="md" style={styles.introCard}>
            <Text style={styles.introTitle}>Same vicinity as you</Text>
            <Text style={styles.introBody}>
              Browse fellow exchange students and verified host families around{' '}
              {place}. Open a profile to learn more before you message or book.
            </Text>
          </Card>

          <View style={styles.tabRow}>
            {tabs.map((option) => {
              const active = tab === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.tabChip, active && styles.tabChipActive]}
                  onPress={() => setTab(option.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    style={[styles.tabChipText, active && styles.tabChipTextActive]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {tab === 'students' ? (
            <>
              <SectionHeader
                title="International students"
                subtitle="People settling into the same city"
              />
              {students.length === 0 ? (
                <EmptyState
                  title="No students listed yet"
                  body="When other students complete their travel profile in this city, they will show up here."
                  tip="Finish your own bio and about section so peers can find you too."
                  iconGlyph="🎓"
                />
              ) : (
                students.map((student) => (
                  <Pressable
                    key={student.userId}
                    style={({ pressed }) => [styles.rowPress, pressed && styles.pressed]}
                    onPress={() => onStudentPress?.(student.userId)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${student.fullName}`}
                  >
                    <Card style={styles.rowCard}>
                      <Avatar initials={student.initials} size="md" />
                      <View style={styles.rowBody}>
                        <View style={styles.rowTop}>
                          <Text style={styles.name} numberOfLines={2}>
                            {student.fullName}
                          </Text>
                          {student.identityVerified ? (
                            <StatusBadge label="Verified" tone="success" />
                          ) : null}
                        </View>
                        <Text style={styles.meta} numberOfLines={1}>
                          {[student.university, student.city, student.nationality]
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                        {student.bio ? (
                          <Text style={styles.bio} numberOfLines={2}>
                            {student.bio}
                          </Text>
                        ) : null}
                      </View>
                    </Card>
                  </Pressable>
                ))
              )}
            </>
          ) : (
            <>
              <SectionHeader
                title="Host families"
                subtitle="Verified homes open to students nearby"
              />
              {hosts.length === 0 ? (
                <EmptyState
                  title="No host families yet"
                  body="Verified host listings in this city will appear here as families go live."
                  tip="You can also search hosts from Explore."
                  iconGlyph="🏡"
                />
              ) : (
                hosts.map((host) => (
                  <Pressable
                    key={host.hostId}
                    style={({ pressed }) => [styles.rowPress, pressed && styles.pressed]}
                    onPress={() => onHostPress?.(host.hostId)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${host.fullName}`}
                  >
                    <Card style={styles.rowCard}>
                      <Avatar initials={host.initials} size="md" />
                      <View style={styles.rowBody}>
                        <View style={styles.rowTop}>
                          <Text style={styles.name} numberOfLines={2}>
                            {host.fullName}
                          </Text>
                          {host.identityVerified ? (
                            <StatusBadge label="Verified" tone="success" />
                          ) : null}
                        </View>
                        <Text style={styles.meta} numberOfLines={2}>
                          {[host.roomType, host.city, host.address]
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                        <Text style={styles.bio} numberOfLines={1}>
                          {host.pricePerNight != null
                            ? `GHS ${Number(host.pricePerNight).toFixed(0)} / night`
                            : 'See listing for rates'}
                          {host.averageRating != null
                            ? ` · ★ ${Number(host.averageRating).toFixed(1)}`
                            : ''}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                ))
              )}
            </>
          )}
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
      gap: spacing.md,
    },
    loadingLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
    },
    introCard: {
      backgroundColor: colors.warmCream,
      gap: spacing.xs,
    },
    introTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    introBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    tabRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    tabChip: {
      flex: 1,
      minHeight: touchTarget,
      borderRadius: borderRadius.pill,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    tabChipActive: {
      backgroundColor: colors.teal,
      borderColor: colors.teal,
    },
    tabChipText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
    },
    tabChipTextActive: {
      color: colors.onPrimary,
    },
    rowPress: {
      minHeight: touchTarget,
    },
    rowCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    rowBody: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    name: {
      flex: 1,
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
    },
    bio: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}

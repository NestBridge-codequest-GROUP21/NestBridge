import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
} from '../../constants/theme';

export interface UniversityDirectoryItem {
  id: string;
  name: string;
  city: string;
  reason: string;
}

export interface UniversitiesDirectoryScreenProps {
  cityLabel: string;
  universities: UniversityDirectoryItem[];
  onBack?: () => void;
}

export default function UniversitiesDirectoryScreen({
  cityLabel,
  universities,
  onBack,
}: UniversitiesDirectoryScreenProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Nearby universities"
        subtitle={`Campuses and institutions near ${cityLabel}`}
        compact
        onBack={onBack}
      />

      <ScreenScroll>
        {universities.length === 0 ? (
          <EmptyState
            title="No campuses listed yet"
            body={`We do not have tertiary institutions mapped for ${cityLabel} yet.`}
            tip="Try another destination city, or check Explore for host stays near campus."
            iconGlyph="🎓"
          />
        ) : (
          universities.map((uni, index) => (
            <Card key={uni.id} padding="lg" elevation="card" style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.index}>{index + 1}</Text>
                <View style={styles.body}>
                  <Text style={styles.name}>{uni.name}</Text>
                  <Text style={styles.meta}>📍 {uni.city}</Text>
                  <Text style={styles.reason}>{uni.reason}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'flex-start',
    },
    index: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.subheading,
      color: colors.teal,
      minWidth: spacing.lg,
    },
    body: {
      flex: 1,
      gap: spacing.xs,
    },
    name: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.subheading,
      color: colors.textPrimary,
    },
    meta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    reason: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
  });
}

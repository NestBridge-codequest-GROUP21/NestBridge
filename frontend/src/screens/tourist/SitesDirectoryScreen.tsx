import React from 'react';
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
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  layout,
} from '../../constants/theme';

export interface SiteDirectoryItem {
  id: string;
  name: string;
  city: string;
  description: string;
  admission: string;
}

export interface SitesDirectoryScreenProps {
  cityLabel: string;
  sites: SiteDirectoryItem[];
  onSitePress?: (siteId: string) => void;
  onBack?: () => void;
}

export default function SitesDirectoryScreen({
  cityLabel,
  sites,
  onSitePress,
  onBack,
}: SitesDirectoryScreenProps) {
  const insets = useSafeAreaInsets();

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
        <Text style={styles.headerTitle}>Sites & culture</Text>
        <Text style={styles.headerSubtitle}>
          Heritage, markets, and must-see places near {cityLabel}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sites.map((site) => (
          <Pressable
            key={site.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onSitePress?.(site.id)}
            accessibilityRole="button"
            accessibilityLabel={site.name}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{site.name}</Text>
              <Text style={styles.cardCity}>{site.city}</Text>
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {site.description}
            </Text>
            <Text style={styles.cardAdmission}>{site.admission}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardCity: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
  cardDescription: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  cardAdmission: {
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
});

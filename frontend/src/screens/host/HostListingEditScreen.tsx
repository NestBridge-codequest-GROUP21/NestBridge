import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SectionHeader from '../../components/SectionHeader';
import AppIcon from '../../components/AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  touchTarget,
  iconSizes,
} from '../../constants/theme';

export type HostListingEditFocus = 'photos' | 'rules';

export interface HostListingEditScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  /** Which section to emphasise first. */
  focus?: HostListingEditFocus;
  photos: string[];
  houseRules: string;
  loading?: boolean;
  saving?: boolean;
  addingPhoto?: boolean;
  maxPhotos?: number;
  onHouseRulesChange?: (value: string) => void;
  onAddPhotoPress?: () => void;
  onRemovePhotoPress?: (photoUri: string) => void;
  onSavePress?: () => void;
  onBack?: () => void;
}

export default function HostListingEditScreen({
  greeting,
  userName,
  userInitials,
  statusIcon = '🏠',
  statusLabel = 'Listing',
  focus = 'photos',
  photos,
  houseRules,
  loading = false,
  saving = false,
  addingPhoto = false,
  maxPhotos = 8,
  onHouseRulesChange,
  onAddPhotoPress,
  onRemovePhotoPress,
  onSavePress,
  onBack,
}: HostListingEditScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const canAddPhoto = photos.length < maxPhotos && !addingPhoto && !saving;

  const photosSection = (
    <View style={styles.section}>
      <SectionHeader
        title="Listing photos"
        subtitle="Guests see these when they browse your homestay"
      />
      <Card style={styles.card}>
        {photos.length === 0 ? (
          <Text style={styles.emptyHint}>
            No photos yet. Add clear shots of the room, bathroom, and shared spaces.
          </Text>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((uri) => (
              <View key={uri} style={styles.photoCell}>
                <Image source={{ uri }} style={styles.photoImage} accessibilityLabel="Listing photo" />
                <Pressable
                  style={({ pressed }) => [
                    styles.removePhoto,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onRemovePhotoPress?.(uri)}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Remove photo"
                >
                  <Text style={styles.removePhotoLabel}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.addPhotoButton,
            (!canAddPhoto || saving) && styles.addPhotoDisabled,
            pressed && canAddPhoto && styles.pressed,
          ]}
          onPress={onAddPhotoPress}
          disabled={!canAddPhoto || saving}
          accessibilityRole="button"
          accessibilityLabel="Add listing photo"
          accessibilityState={{ disabled: !canAddPhoto || saving, busy: addingPhoto }}
        >
          {addingPhoto ? (
            <ActivityIndicator color={colors.teal} />
          ) : (
            <>
              <AppIcon glyph="📸" size={iconSizes.md} color={colors.teal} />
              <Text style={styles.addPhotoLabel}>
                {photos.length >= maxPhotos
                  ? `Photo limit reached (${maxPhotos})`
                  : 'Add photo'}
              </Text>
            </>
          )}
        </Pressable>
        <Text style={styles.helper}>
          {photos.length}/{maxPhotos} photos · Mobile Money guests book homes they can see
        </Text>
      </Card>
    </View>
  );

  const rulesSection = (
    <View style={styles.section}>
      <SectionHeader
        title="House rules"
        subtitle="Quiet hours, guests, kitchen use, and anything travellers should know"
      />
      <Card style={styles.card}>
        <FormTextField
          label="Rules guests should follow"
          value={houseRules}
          placeholder="e.g. Quiet after 10pm · No smoking indoors · Guests welcome with notice · Shared kitchen evenings"
          onChangeText={onHouseRulesChange}
          multiline
          numberOfLines={6}
          editable={!saving && !loading}
          helperText="Clear rules help the right guests choose you and reduce surprises."
        />
      </Card>
    </View>
  );

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

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingLabel}>Loading your listing…</Text>
        </View>
      ) : (
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Edit your listing</Text>
          <Text style={styles.pageSubtitle}>
            Update photos and house rules guests see on your profile.
          </Text>

          {focus === 'rules' ? (
            <>
              {rulesSection}
              {photosSection}
            </>
          ) : (
            <>
              {photosSection}
              {rulesSection}
            </>
          )}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save listing'}
            onPress={onSavePress}
            disabled={saving}
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
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    pageTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.heading,
      lineHeight: lineHeights.heading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    pageSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
      marginTop: -spacing.sm,
    },
    section: {
      gap: spacing.sm,
    },
    card: {
      gap: spacing.md,
    },
    emptyHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    photoCell: {
      width: '47%',
      flexGrow: 1,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.warmCream,
    },
    photoImage: {
      width: '100%',
      aspectRatio: 4 / 3,
      backgroundColor: colors.border,
    },
    removePhoto: {
      minHeight: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    removePhotoLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      fontWeight: fontWeights.semibold,
      color: colors.danger,
    },
    addPhotoButton: {
      minHeight: touchTarget,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: borderWidths.strong,
      borderColor: colors.teal,
      borderStyle: 'dashed',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    addPhotoDisabled: {
      opacity: 0.5,
    },
    addPhotoLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    helper: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    loadingLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}

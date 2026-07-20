import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import SectionHeader from '../../components/SectionHeader';
import type { TourTypeOption } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  lineHeights,
  touchTarget,
} from '../../constants/theme';

export interface TourTypesSetupScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  tourTypes: TourTypeOption[];
  baseRate: string;
  maxGroupSize: string;
  onToggleTourType?: (tourTypeId: string, enabled: boolean) => void;
  onAddTourType?: (label: string, description: string) => string | null;
  onUpdateTourType?: (
    tourTypeId: string,
    label: string,
    description: string,
  ) => string | null;
  onRemoveTourType?: (tourTypeId: string) => void;
  onBaseRateChange?: (value: string) => void;
  onMaxGroupSizeChange?: (value: string) => void;
  onSavePress?: () => void;
  onBack?: () => void;
}

function TourTypeRow({
  tourType,
  isLast,
  isEditing,
  draftLabel,
  draftDescription,
  onToggle,
  onStartEdit,
  onDraftLabelChange,
  onDraftDescriptionChange,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: {
  tourType: TourTypeOption;
  isLast: boolean;
  isEditing: boolean;
  draftLabel: string;
  draftDescription: string;
  onToggle?: (enabled: boolean) => void;
  onStartEdit?: () => void;
  onDraftLabelChange?: (value: string) => void;
  onDraftDescriptionChange?: (value: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onRemove?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (isEditing) {
    return (
      <View style={[styles.tourRow, styles.tourRowEdit, isLast && styles.tourRowLast]}>
        <FormTextField
          label="Tour type name"
          value={draftLabel}
          placeholder="e.g. Coastal heritage walk"
          onChangeText={onDraftLabelChange}
        />
        <FormTextField
          label="Description"
          value={draftDescription}
          placeholder="What guests experience"
          onChangeText={onDraftDescriptionChange}
        />
        <View style={styles.editActions}>
          <SecondaryButton label="Cancel" onPress={onCancelEdit} style={styles.editButton} />
          <PrimaryButton label="Update" onPress={onSaveEdit} style={styles.editButton} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.tourRow, isLast && styles.tourRowLast]}>
      <View style={styles.tourInfo}>
        <Text style={styles.tourLabel}>{tourType.label}</Text>
        <Text style={styles.tourDescription}>{tourType.description}</Text>
        <View style={styles.rowActions}>
          <Pressable
            onPress={onStartEdit}
            style={styles.textAction}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${tourType.label}`}
          >
            <Text style={styles.textActionLabel}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={onRemove}
            style={styles.textAction}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${tourType.label}`}
          >
            <Text style={styles.textActionDanger}>Remove</Text>
          </Pressable>
        </View>
      </View>
      <Switch
        value={tourType.enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.tealBright }}
        thumbColor={colors.white}
        accessibilityLabel={`Toggle ${tourType.label}`}
      />
    </View>
  );
}

export default function TourTypesSetupScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  tourTypes,
  baseRate,
  maxGroupSize,
  onToggleTourType,
  onAddTourType,
  onUpdateTourType,
  onRemoveTourType,
  onBaseRateChange,
  onMaxGroupSizeChange,
  onSavePress,
  onBack,
}: TourTypesSetupScreenProps) {
  const styles = useThemedStyles(createStyles);
  const [newLabel, setNewLabel] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [draftDescription, setDraftDescription] = useState('');

  const handleAdd = () => {
    const error = onAddTourType?.(newLabel, newDescription) ?? null;
    if (error) {
      Alert.alert('Could not add tour type', error);
      return;
    }
    setNewLabel('');
    setNewDescription('');
  };

  const startEdit = (tourType: TourTypeOption) => {
    setEditingId(tourType.id);
    setDraftLabel(tourType.label);
    setDraftDescription(tourType.description);
  };

  const saveEdit = () => {
    if (!editingId) {
      return;
    }
    const error =
      onUpdateTourType?.(editingId, draftLabel, draftDescription) ?? null;
    if (error) {
      Alert.alert('Could not update tour type', error);
      return;
    }
    setEditingId(null);
  };

  const confirmRemove = (tourType: TourTypeOption) => {
    Alert.alert(
      'Remove tour type',
      `Remove “${tourType.label}” from your catalogue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveTourType?.(tourType.id),
        },
      ],
    );
  };

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
          title="Tour types"
          subtitle="Add, edit, or remove the experiences you offer and set your base pricing."
        />

        <Card padding="md" style={styles.section}>
          {tourTypes.length === 0 ? (
            <Text style={styles.emptyHint}>
              No tour types yet. Add your first experience below.
            </Text>
          ) : (
            tourTypes.map((tourType, index) => (
              <TourTypeRow
                key={tourType.id}
                tourType={tourType}
                isLast={index === tourTypes.length - 1 && editingId !== tourType.id}
                isEditing={editingId === tourType.id}
                draftLabel={draftLabel}
                draftDescription={draftDescription}
                onToggle={(enabled) => onToggleTourType?.(tourType.id, enabled)}
                onStartEdit={() => startEdit(tourType)}
                onDraftLabelChange={setDraftLabel}
                onDraftDescriptionChange={setDraftDescription}
                onSaveEdit={saveEdit}
                onCancelEdit={() => setEditingId(null)}
                onRemove={() => confirmRemove(tourType)}
              />
            ))
          )}
        </Card>

        <Card padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Add a tour type</Text>
          <FormTextField
            label="Tour type name"
            value={newLabel}
            placeholder="e.g. Night market tasting"
            onChangeText={setNewLabel}
          />
          <FormTextField
            label="Description"
            value={newDescription}
            placeholder="Short description for travellers"
            onChangeText={setNewDescription}
          />
          <SecondaryButton label="Add tour type" onPress={handleAdd} />
        </Card>

        <Card padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & capacity</Text>
          <FormTextField
            label="Base rate (GHS)"
            value={baseRate}
            placeholder="45"
            keyboardType="numeric"
            onChangeText={onBaseRateChange}
          />
          <FormTextField
            label="Max group size"
            value={maxGroupSize}
            placeholder="8"
            keyboardType="numeric"
            onChangeText={onMaxGroupSizeChange}
          />
        </Card>

        <PrimaryButton label="Save tour settings" onPress={onSavePress} />
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.md,
  },
  emptyHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  tourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
    gap: spacing.md,
    minHeight: touchTarget + spacing.md,
  },
  tourRowEdit: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tourRowLast: {
    borderBottomWidth: 0,
  },
  tourInfo: {
    flex: 1,
  },
  tourLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tourDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  rowActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    minHeight: touchTarget,
    alignItems: 'center',
  },
  textAction: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  textActionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  textActionDanger: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editButton: {
    flex: 1,
  },
});
}

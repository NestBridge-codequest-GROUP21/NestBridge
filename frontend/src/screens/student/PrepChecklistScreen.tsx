import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import ProgressBar from '../../components/ProgressBar';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import PrimaryButton from '../../components/PrimaryButton';
import SectionHeader from '../../components/SectionHeader';
import FocusAwareTextInput from '../../components/FocusAwareTextInput';
import type { ChecklistTask } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  controlHeights,
  layout,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

export interface PrepChecklistScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  tasks: ChecklistTask[];
  onToggleTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onBack?: () => void;
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const styles = useThemedStyles(createStyles);

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card style={styles.progressRing} padding="md">
      <Text style={styles.progressCount}>
        {completed}/{total}
      </Text>
      <Text style={styles.progressLabel}>Done</Text>
      <Text style={styles.progressPercent}>{percent}%</Text>
    </Card>
  );
}

export default function PrepChecklistScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  tasks,
  onToggleTask,
  onDeleteTask,
  onBack,
}: PrepChecklistScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.prepChecklist;

  const [customTasks, setCustomTasks] = useState<ChecklistTask[]>([]);
  const [newItemLabel, setNewItemLabel] = useState('');

  const handleAddItem = () => {
    const label = newItemLabel.trim();
    if (label.length === 0) {
      return;
    }
    setCustomTasks((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, label, completed: false },
    ]);
    setNewItemLabel('');
  };

  const handleToggleCustom = (taskId: string) => {
    setCustomTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDeleteCustom = (taskId: string) => {
    setCustomTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const allTasks = [...tasks, ...customTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;
  const percent =
    allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

  const renderTaskRow = (
    task: ChecklistTask,
    onToggle: (id: string) => void,
    onDelete: (id: string) => void,
  ) => (
    <Card key={task.id} style={styles.taskRow} padding="none">
      <Pressable
        style={styles.taskMain}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={task.label}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed ? (
            <AppIcon name="checkmark" size={iconSizes.sm} color={colors.onPrimary} />
          ) : null}
        </View>
        <Text
          style={[styles.taskLabel, task.completed && styles.taskLabelCompleted]}
        >
          {task.label}
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
        onPress={() => onDelete(task.id)}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${task.label}`}
      >
        <AppIcon name="close" size={iconSizes.md} color={colors.textTertiary} />
      </Pressable>
    </Card>
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

      <ScreenScroll keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={styles.titleTextWrap}>
            <SectionHeader
              title="Prep & packing"
              subtitle="Get ready for your stay — adapters, documents, and local essentials."
              style={styles.sectionHeader}
            />
          </View>
          <ProgressRing completed={completedCount} total={allTasks.length} />
        </View>

        <ProgressBar percent={percent} style={styles.progressBar} />

        {allTasks.length === 0 ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            style={styles.emptyState}
          />
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) =>
              renderTaskRow(
                task,
                (id) => onToggleTask?.(id),
                (id) => onDeleteTask?.(id),
              ),
            )}
            {customTasks.map((task) =>
              renderTaskRow(task, handleToggleCustom, handleDeleteCustom),
            )}
          </View>
        )}

        <Card style={styles.addCard} padding="md">
          <Text style={styles.addTitle}>Add your own item</Text>
          <View style={styles.addRow}>
            <FocusAwareTextInput
              style={styles.addInput}
              containerStyle={styles.addInputWrap}
              value={newItemLabel}
              onChangeText={setNewItemLabel}
              placeholder="e.g. UK plug adapter / MoMo float"
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
              accessibilityLabel="New checklist item"
            />
            <PrimaryButton
              label="Add"
              onPress={handleAddItem}
              disabled={newItemLabel.trim().length === 0}
              style={styles.addButton}
            />
          </View>
        </Card>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  titleTextWrap: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  progressRing: {
    alignItems: 'center',
    minWidth: spacing.xxl + spacing.xl,
  },
  progressCount: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    lineHeight: lineHeights.subheading,
  },
  progressLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: lineHeights.caption,
  },
  progressPercent: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.success,
    marginTop: spacing.xs,
    lineHeight: lineHeights.caption,
  },
  progressBar: {
    marginBottom: layout.sectionGap,
  },
  emptyState: {
    marginBottom: layout.sectionGap,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingLeft: layout.cardPadding,
    paddingRight: spacing.sm,
    minHeight: controlHeights.lg + spacing.sm,
    gap: spacing.xs,
  },
  taskMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touchTarget,
    paddingVertical: spacing.xs,
  },
  deleteButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePressed: {
    opacity: 0.6,
  },
  checkbox: {
    width: iconSizes.xl,
    height: iconSizes.xl,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidths.strong,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  taskLabelCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  addCard: {
    marginTop: layout.sectionGap,
  },
  addTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addInputWrap: {
    flex: 1,
  },
  addInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    minHeight: controlHeights.md,
  },
  addButton: {
    minHeight: controlHeights.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'stretch',
  },
});
}



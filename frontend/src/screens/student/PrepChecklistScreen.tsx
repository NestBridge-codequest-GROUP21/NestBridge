import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import ProgressBar from '../../components/ProgressBar';
import AppIcon from '../../components/AppIcon';
import EmptyState from '../../components/EmptyState';
import type { ChecklistTask } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
} from '../../constants/theme';

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
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.progressRing}>
      <Text style={styles.progressCount}>
        {completed}/{total}
      </Text>
      <Text style={styles.progressLabel}>Done</Text>
      <Text style={styles.progressPercent}>{percent}%</Text>
    </View>
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
    <View key={task.id} style={styles.taskRow}>
      <Pressable
        style={styles.taskMain}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={task.label}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed ? (
            <AppIcon name="checkmark" size={fontSizes.caption} color={colors.white} />
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
        <AppIcon name="close" size={fontSizes.body} color={colors.textTertiary} />
      </Pressable>
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

      <ScreenScroll keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={styles.titleTextWrap}>
            <Text style={styles.screenTitle}>Prep & packing</Text>
            <Text style={styles.screenSubtitle}>
              Get ready for your stay — adapters, documents, and local essentials.
            </Text>
          </View>
          <ProgressRing completed={completedCount} total={allTasks.length} />
        </View>

        <ProgressBar percent={percent} style={styles.progressBar} />

        {allTasks.length === 0 ? (
          <EmptyState
            iconName="clipboard-outline"
            title="Your checklist is empty"
            body="Add items you need before arrival — travel adapter, MoMo float, and copies of your documents."
            tip="Use the field below to add anything you don't want to forget."
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

        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add your own item</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={newItemLabel}
              onChangeText={setNewItemLabel}
              placeholder="e.g. UK plug adapter / MoMo float"
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
              accessibilityLabel="New checklist item"
            />
            <Pressable
              style={[
                styles.addButton,
                newItemLabel.trim().length === 0 && styles.addButtonDisabled,
              ]}
              onPress={handleAddItem}
              disabled={newItemLabel.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Add item"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  titleTextWrap: {
    flex: 1,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: lineHeights.heading,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  progressRing: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minWidth: 88,
    ...shadows.card,
  },
  progressCount: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
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
    marginBottom: spacing.lg,
  },
  emptyState: {
    marginBottom: spacing.lg,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    minHeight: 56,
    gap: spacing.xs,
    ...shadows.card,
  },
  taskMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.xs,
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePressed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
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
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
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
  addInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    minHeight: 48,
  },
  addButton: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
});

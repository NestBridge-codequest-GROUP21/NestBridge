import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import type { ChecklistTask } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../../constants/theme';

export interface PrepChecklistScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  tasks: ChecklistTask[];
  onToggleTask?: (taskId: string) => void;
  onBack?: () => void;
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.progressRing}>
      <Text style={styles.progressCount}>
        {completed}/{total}
      </Text>
      <Text style={styles.progressLabel}>Completed</Text>
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
  onBack,
}: PrepChecklistScreenProps) {
  const completedCount = tasks.filter((t) => t.completed).length;

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
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Prep & Packing Checklist</Text>
          <ProgressRing completed={completedCount} total={tasks.length} />
        </View>

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <Pressable
              key={task.id}
              style={styles.taskRow}
              onPress={() => onToggleTask?.(task.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.completed }}
              accessibilityLabel={task.label}
            >
              <View
                style={[
                  styles.checkbox,
                  task.completed && styles.checkboxChecked,
                ]}
              >
                {task.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.taskLabel,
                  task.completed && styles.taskLabelCompleted,
                ]}
              >
                {task.label}
              </Text>
            </Pressable>
          ))}
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
  },
  screenTitle: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    paddingRight: spacing.md,
  },
  progressRing: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minWidth: 88,
  },
  progressCount: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    color: colors.teal,
  },
  progressLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressPercent: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.success,
    marginTop: spacing.xs,
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
    padding: spacing.md,
    minHeight: 56,
    gap: spacing.md,
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
  checkmark: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    color: colors.white,
  },
  taskLabel: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  taskLabelCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});

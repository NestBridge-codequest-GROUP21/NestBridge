import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, layout } from '../constants/theme';
import { useTheme } from '../theme';
import useKeyboardHeight from '../hooks/useKeyboardHeight';
import {
  KeyboardScrollProvider,
  type KeyboardScrollFocusTarget,
} from './keyboardScrollContext';

const FOCUS_GAP = spacing.lg;
const FOCUS_DELAY_MS = Platform.OS === 'ios' ? 60 : 120;

export interface ScreenScrollProps extends ScrollViewProps {
  withTabBar?: boolean;
  withSosDock?: boolean;
  /**
   * When true (default), avoids the soft keyboard and scrolls the focused
   * input into view. Set false only for read-only browse lists if needed.
   */
  keyboardAware?: boolean;
  /** Offset for sticky headers above this scroll view (iOS KAV). */
  keyboardVerticalOffset?: number;
  /** Convenience pull-to-refresh — builds RefreshControl with brand colors. */
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

/**
 * App-wide scroll container with keyboard avoidance + scroll-to-focused-input.
 * Use this for every form / text-input screen instead of a raw ScrollView.
 */
export default function ScreenScroll({
  withTabBar = false,
  withSosDock = false,
  keyboardAware = true,
  keyboardVerticalOffset = 0,
  children,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = 'handled',
  onScroll,
  refreshing = false,
  onRefresh,
  refreshControl,
  ...rest
}: ScreenScrollProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const keyboardHeight = useKeyboardHeight();
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const focusTargetRef = useRef<KeyboardScrollFocusTarget>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseBottomPad = withTabBar
    ? insets.bottom +
      (withSosDock ? layout.scrollBottomInsetWithSos : layout.scrollBottomInset)
    : insets.bottom + spacing.lg;

  const keyboardPad =
    keyboardAware && Platform.OS === 'android' ? keyboardHeight : 0;

  const ensureFocusedVisible = useCallback(
    (target: KeyboardScrollFocusTarget) => {
      if (!target || !scrollRef.current) {
        return;
      }

      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }

      focusTimerRef.current = setTimeout(() => {
        const windowHeight = Dimensions.get('window').height;
        const kb = keyboardHeight;
        const effectiveKb = kb > 0 ? kb : Platform.OS === 'android' ? 280 : 0;
        if (effectiveKb <= 0) {
          return;
        }

        target.measureInWindow((_x, y, _w, height) => {
          const inputBottom = y + height;
          const visibleBottom = windowHeight - effectiveKb - FOCUS_GAP;
          if (inputBottom <= visibleBottom) {
            return;
          }
          const delta = inputBottom - visibleBottom;
          scrollRef.current?.scrollTo({
            y: Math.max(0, scrollYRef.current + delta),
            animated: true,
          });
        });
      }, FOCUS_DELAY_MS);
    },
    [keyboardHeight],
  );

  const requestScrollToFocused = useCallback(
    (target: KeyboardScrollFocusTarget) => {
      focusTargetRef.current = target;
      ensureFocusedVisible(target);
    },
    [ensureFocusedVisible],
  );

  useEffect(() => {
    if (keyboardHeight > 0 && focusTargetRef.current) {
      ensureFocusedVisible(focusTargetRef.current);
    }
  }, [keyboardHeight, ensureFocusedVisible]);

  useEffect(
    () => () => {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ requestScrollToFocused }),
    [requestScrollToFocused],
  );

  const resolvedRefreshControl =
    refreshControl ??
    (onRefresh ? (
      <RefreshControl
        refreshing={Boolean(refreshing)}
        onRefresh={onRefresh}
        tintColor={colors.teal}
        colors={[colors.teal]}
        progressBackgroundColor={colors.surface}
        enabled
      />
    ) : undefined);

  const pullToRefreshEnabled = Boolean(resolvedRefreshControl);
  // Android only fires RefreshControl when the scroll view can overscroll.
  // Short error-only screens need a taller content area + always overscroll.
  const windowHeight = Dimensions.get('window').height;
  const refreshMinHeight = pullToRefreshEnabled
    ? windowHeight - insets.top - (withTabBar ? layout.scrollBottomInset : 0) + 1
    : undefined;

  const scroll = (
    <ScrollView
      ref={scrollRef}
      style={[styles.scroll, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      nestedScrollEnabled
      scrollEnabled
      contentContainerStyle={[
        styles.content,
        pullToRefreshEnabled ? styles.contentForRefresh : styles.contentGrow,
        refreshMinHeight != null ? { minHeight: refreshMinHeight } : null,
        { paddingBottom: baseBottomPad + keyboardPad },
        contentContainerStyle,
      ]}
      scrollEventThrottle={16}
      onScroll={(event) => {
        scrollYRef.current = event.nativeEvent.contentOffset.y;
        onScroll?.(event);
      }}
      {...rest}
      alwaysBounceVertical={pullToRefreshEnabled ? true : rest.alwaysBounceVertical}
      bounces={pullToRefreshEnabled ? true : rest.bounces}
      overScrollMode={pullToRefreshEnabled ? 'always' : rest.overScrollMode}
      refreshControl={resolvedRefreshControl}
    >
      <KeyboardScrollProvider value={contextValue}>
        {children}
      </KeyboardScrollProvider>
    </ScrollView>
  );

  // KeyboardAvoidingView can steal the pull gesture on some Android builds.
  if (!keyboardAware || pullToRefreshEnabled) {
    return scroll;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={Platform.OS === 'ios'}
    >
      {scroll}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  contentGrow: {
    flexGrow: 1,
  },
  contentForRefresh: {
    // Avoid flexGrow:1 with RefreshControl — it blocks pull on short Android screens.
    flexGrow: 0,
  },
});

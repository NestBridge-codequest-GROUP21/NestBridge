import { useCallback, useRef } from 'react';
import type { View } from 'react-native';
import { useKeyboardScroll } from '../components/keyboardScrollContext';

/**
 * Attach `containerRef` to the View wrapping a TextInput, and call
 * `onInputFocus` from the input's onFocus to keep it above the keyboard
 * when inside ScreenScroll.
 */
export default function useScrollFocusedInputIntoView() {
  const keyboardScroll = useKeyboardScroll();
  const containerRef = useRef<View>(null);

  const onInputFocus = useCallback(() => {
    keyboardScroll?.requestScrollToFocused(containerRef.current);
  }, [keyboardScroll]);

  return { containerRef, onInputFocus };
}

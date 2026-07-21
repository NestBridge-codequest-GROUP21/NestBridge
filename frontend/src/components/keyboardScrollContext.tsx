import React, { createContext, useContext } from 'react';
import type { View } from 'react-native';

export type KeyboardScrollFocusTarget = View | null;

export interface KeyboardScrollContextValue {
  /** Ask the parent scroll view to keep this input above the keyboard. */
  requestScrollToFocused: (target: KeyboardScrollFocusTarget) => void;
}

const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(
  null,
);

export function KeyboardScrollProvider({
  value,
  children,
}: {
  value: KeyboardScrollContextValue;
  children: React.ReactNode;
}) {
  return (
    <KeyboardScrollContext.Provider value={value}>
      {children}
    </KeyboardScrollContext.Provider>
  );
}

export function useKeyboardScroll(): KeyboardScrollContextValue | null {
  return useContext(KeyboardScrollContext);
}

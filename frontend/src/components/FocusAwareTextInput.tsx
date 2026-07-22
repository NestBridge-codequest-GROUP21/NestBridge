import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import useScrollFocusedInputIntoView from '../hooks/useScrollFocusedInputIntoView';

export interface FocusAwareTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * TextInput that asks ScreenScroll to keep it above the keyboard on focus.
 * Use for one-off fields that are not FormTextField / SearchField.
 */
export default function FocusAwareTextInput({
  containerStyle,
  onFocus,
  style,
  ...rest
}: FocusAwareTextInputProps) {
  const { containerRef, onInputFocus } = useScrollFocusedInputIntoView();

  return (
    <View ref={containerRef} collapsable={false} style={[styles.wrap, containerStyle]}>
      <TextInput
        {...rest}
        style={style}
        onFocus={(event) => {
          onInputFocus();
          onFocus?.(event);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
});

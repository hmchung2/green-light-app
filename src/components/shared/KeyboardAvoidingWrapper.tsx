import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
}

const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  keyboardVerticalOffset = 55, // Default value
}) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        enabled>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardAvoidingWrapper;

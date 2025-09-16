import {styled, useTheme} from 'styled-components/native';
import React, {forwardRef, Ref} from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTInputProps,
} from 'react-native';

interface TextInputProps extends RNTInputProps {
  lastOne?: boolean;
}

const BaseTextInput = (
  {lastOne, ...restProps}: TextInputProps,
  ref: Ref<RNTextInput>,
) => {
  const theme = useTheme();

  return (
    <RNTextInput
      {...restProps}
      ref={ref}
      placeholderTextColor={theme.placeholderFontColor}
    />
  );
};

export const TextInput = styled(forwardRef(BaseTextInput))`
  background-color: rgba(78, 19, 19, 0.15);
  padding: 15px 7px;
  border-radius: 4px;
  color: ${props => props.theme.fontColor};
  margin-bottom: ${(props: TextInputProps) => (props.lastOne ? '15px' : '8px')};
`;

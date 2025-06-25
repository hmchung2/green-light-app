import React from 'react';
import styled from 'styled-components/native';
import LabeledInputContainer from './LabeldComponent.tsx';

const TextInput = styled.TextInput`
  padding: 5px;
  font-size: 15px;
  color: ${props => props.theme.fontColor};
`;

interface LabeledTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export default function LabeledTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: LabeledTextInputProps) {
  return (
    <LabeledInputContainer label={label}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
      />
    </LabeledInputContainer>
  );
}

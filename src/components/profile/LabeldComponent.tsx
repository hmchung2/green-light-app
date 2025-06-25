import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  padding: 10px 0;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 1px;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${props => props.theme.fontColor};
  margin-top: 5px;
`;

interface LabeledInputContainerProps {
  label: string;
  children: React.ReactNode;
}

export default function LabeledInputContainer({
  label,
  children,
}: LabeledInputContainerProps) {
  return (
    <Container>
      <Label>{label}</Label>
      {children}
      <Separator />
    </Container>
  );
}

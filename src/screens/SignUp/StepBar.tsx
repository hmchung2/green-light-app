import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import {RootStackParamList} from '../../shared/shared.types';
import {ViewStyle} from 'react-native';

type StepBarProps = {
  currentStep: string;
  visitedSteps: string[]; // ✅ now correctly typed as number[]
  onBeforeNavigate: (nextPage: keyof RootStackParamList) => void;
  style?: ViewStyle;
};

const Container = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StepBtn = styled.TouchableOpacity`
  background-color: gray;
  border-radius: 10px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 70%;
`;

const Text = styled.Text`
  color: white;
  font-size: 17px;
`;

const getStepColor = (
  step: string,
  currentPage: string,
  visitedSteps: string[],
): string => {
  if (step === currentPage) {
    return colors.green; // 🟩 current step
  }
  if (visitedSteps.includes(step)) {
    return colors.inactiveGreen; // 🔵 visited but not current
  }
  return colors.gray; // ⚪️ not visited
};

export default function StepBar({
  currentStep,
  visitedSteps,
  style,
  onBeforeNavigate,
}: StepBarProps) {
  const steps: {
    label: string;
    page: keyof RootStackParamList;
  }[] = [
    {label: '1', page: 'StepOne'},
    {label: '2', page: 'StepTwo'},
    {label: '3', page: 'StepThree'},
    {label: '4', page: 'StepFour'},
    {label: '5', page: 'StepFive'},
  ];

  return (
    <Container style={style}>
      {steps.map(({label, page}) => {
        const isCurrent = page === currentStep;
        const visited = visitedSteps.includes(page);
        const color = getStepColor(page, currentStep, visitedSteps);

        return (
          <StepBtn
            key={label}
            disabled={!visited && !isCurrent}
            onPress={() => onBeforeNavigate(page)}
            style={{backgroundColor: color}}>
            <Text>{label}</Text>
          </StepBtn>
        );
      })}
    </Container>
  );
}

import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Platform, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput} from '../../components/auth/AuthShared';
import {format} from 'date-fns';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';
import {SignUpAppContext} from '../../hooks/SignUpContext.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  CreateAccountValidPage,
  RootStackParamList,
} from '../../shared/shared.types';
import StepBar from './StepBar';

type stepThreeProps = NativeStackScreenProps<RootStackParamList, 'StepThree'>;

const Text = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 20px;
  margin-bottom: 10px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  align-self: center;
`;

export default function StepThree({navigation}: stepThreeProps) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const {birthDay, setBirthDay} = useContext(SignUpAppContext);
  const [errorMsg, setErrorMsg] = useState('');
  const {visitedSteps, setVisitedSteps} = useContext(SignUpAppContext);
  const currentStep = 'StepThree';

  useEffect(() => {
    setVisitedSteps([...visitedSteps, currentStep]);
  }, []);

  const handleNext = (nextPage: keyof RootStackParamList) => {
    if (birthDay == null || birthDay === '') {
      setErrorMsg('Please, write your Birth Date');
      return false;
    }
    navigation.navigate(nextPage as CreateAccountValidPage);
  };

  const HeaderBar = () => (
    <StepBar
      currentStep={currentStep}
      onBeforeNavigate={handleNext}
      visitedSteps={visitedSteps}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: HeaderBar,
    });
  }, [birthDay, visitedSteps]);

  const onChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    const formattedDate = format(currentDate, 'yyyy/MM/dd');
    setBirthDay(formattedDate);
    setErrorMsg('');
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <AuthLayout>
      <Text>Your BirthDay</Text>
      <TouchableOpacity onPress={showDatepicker}>
        <TextInput value={birthDay} editable={false} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
      {errorMsg !== '' && <ErrorText>{errorMsg}</ErrorText>}
      <AuthButton
        text="Next"
        disabled={false}
        onPress={() => handleNext('StepFour')}
      />
    </AuthLayout>
  );
}

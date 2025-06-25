import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator, Alert, TextInput} from 'react-native';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';
import StepBar from './StepBar';
import {SignUpAppContext} from '../../hooks/SignUpContext.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  CreateAccountValidPage,
  RootStackParamList,
} from '../../shared/shared.types';
import {useSendVerificationMutation} from '../../generated/graphql';
import {colors} from '../../colors.ts';
import {useCheckVerificationLazyQuery} from '../../generated/graphql';

type stepFourProps = NativeStackScreenProps<RootStackParamList, 'StepFour'>;

const Title = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 22px;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 14px;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  margin-bottom: 10px;
  color: ${props => props.theme.fontColor};
`;

const RowContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
`;

const EmailInput = styled.TextInput`
  flex: 9;
  padding: 15px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  color: ${props => props.theme.fontColor};
  margin-right: 8px;
`;

const SendButton = styled.TouchableOpacity<{disabled: boolean}>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: ${props =>
    props.disabled
      ? props.theme.disabledButtonColor || '#cccccc'
      : props.theme.buttonColor || '#2196F3'};
  border-radius: 5px;
`;

const SendText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;
export default function StepFour({navigation}: stepFourProps) {
  const {email, setEmail} = useContext(SignUpAppContext);
  const {reservedEmail, setReservedEmail} = useContext(SignUpAppContext);
  const {emailValidated, setEmailValidated} = useContext(SignUpAppContext);
  const {emailCode, setEmailCode} = useContext(SignUpAppContext);
  const [errorMsg, setErrorMsg] = useState('');
  const {visitedSteps, setVisitedSteps} = useContext(SignUpAppContext);

  const currentStep = 'StepFour';

  useEffect(() => {
    setVisitedSteps([...visitedSteps, currentStep]);
  }, []);

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
  }, [email, visitedSteps, emailCode]);

  const [sendVerificationMutation, {loading}] = useSendVerificationMutation({
    onCompleted: data => {
      const {ok, error} = data.sendVerification;
      if (!ok) {
        setErrorMsg(error || 'Failed to send code.');
      } else {
        Alert.alert('Verification email sent', 'Check your inbox.');
        setEmailValidated(false);
      }
    },
    onError: error => {
      // Just log it for dev/debugging purposes
      console.error('Unexpected GraphQL error in sendVerification:', error);
      setErrorMsg('Failed to send code.');
    },
  });

  const isValidEmail = (inputEmail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const [checkVerification, {loading: verifying}] =
    useCheckVerificationLazyQuery({
      onCompleted: data => {
        const {ok, error} = data.checkVerification;
        if (ok) {
          setReservedEmail(email);
          setEmailValidated(true);
          // navigation.navigate('StepFive');
        } else {
          setErrorMsg(error || 'Verification failed.');
          setReservedEmail(null);
          setEmailValidated(false);
        }
      },
      onError: error => {
        console.error('GraphQL error:', error);
        setErrorMsg('Could not verify email.');
      },
    });

  const handleNext = (nextPage: keyof RootStackParamList) => {
    if (!email) {
      setErrorMsg('Please, write your Email');
      return false;
    }
    if (!emailCode) {
      setErrorMsg('Please, enter the confirmation code');
      return false;
    }
    console.log(`Verifying code: ${emailCode}`);
    if (email === reservedEmail && emailValidated) {
      console.log('already valid');
      navigation.navigate(nextPage as CreateAccountValidPage);
      return;
    }
    console.log('checking code');
    checkVerification({variables: {email: email, code: emailCode}}).then(
      result => {
        const {ok} = result.data?.checkVerification || {};
        if (ok) {
          navigation.navigate(nextPage as CreateAccountValidPage);
        }
      },
    );
  };

  const handleSendCode = async () => {
    if (!email) {
      setErrorMsg('Please enter your email before sending the code.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setEmailCode('');

    await sendVerificationMutation({
      variables: {
        email,
        forSignup: true,
      },
    });
  };

  return (
    <AuthLayout>
      <Title>Enter your email</Title>
      <RowContainer>
        <EmailInput
          value={email || ''}
          onChangeText={text => {
            setEmail(text);
            setEmailValidated(false); // reset verification state
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <SendButton
          onPress={handleSendCode}
          disabled={loading || !email?.trim()}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.green} />
          ) : (
            <SendText>{loading ? 'Sending...' : 'Send'}</SendText>
          )}
        </SendButton>
      </RowContainer>
      <Input
        value={emailCode}
        onChangeText={text => {
          setEmailCode(text);
          console.log('false');
          setEmailValidated(false);
          setErrorMsg('');
        }}
        placeholder="Confirmation Code"
        keyboardType="numeric"
        autoCapitalize="none"
      />

      {errorMsg !== '' && (
        <Subtitle style={{color: 'red'}}>{errorMsg}</Subtitle>
      )}

      <AuthButton text="Next" onPress={() => handleNext('StepFive')} />
    </AuthLayout>
  );
}

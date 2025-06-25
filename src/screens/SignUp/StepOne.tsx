import React, {useState, useEffect, useContext} from 'react';
import {Text, View,} from 'react-native';
import AuthButton from '../../components/auth/AuthButton';
import AuthLayout from '../../components/auth/AuthLayout';
import {TextInput} from '../../components/auth/AuthShared';
import StepBar from './StepBar';
import {SignUpAppContext} from '../../hooks/SignUpContext.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  CreateAccountValidPage,
  RootStackParamList,
} from '../../shared/shared.types';
import {useValidCreateAccountLazyQuery} from '../../generated/graphql';

type StepOneProps = NativeStackScreenProps<RootStackParamList, 'StepOne'>;

export default function StepOne({navigation}: StepOneProps) {
  const {username, setUsername} = useContext(SignUpAppContext);
  const {reservedUsername , setReservedUsername } = useContext(SignUpAppContext); // prettier-ignore
  const {password, setPassword} = useContext(SignUpAppContext);
  const {rePassword, setRePassword} = useContext(SignUpAppContext);
  const [errorMsg, setErrorMsg] = useState('');
  const {visitedSteps, setVisitedSteps} = useContext(SignUpAppContext);
  const currentStep = 'StepOne';

  useEffect(() => {
    setVisitedSteps([...visitedSteps, currentStep]);
  }, []);

  const {usernameValidated, usernameSetValidated} =
    useContext(SignUpAppContext);

  const handleInputChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ): void => {
    setFunction(value);
    usernameSetValidated(false);
    setErrorMsg('');
  };

  const [executeQuery, {loading}] = useValidCreateAccountLazyQuery({
    onCompleted: data => {
      if (data?.validCreateAccount?.ok) {
        console.log(data);
        setReservedUsername(username);
        usernameSetValidated(true);
        setErrorMsg('');
        if (data.validCreateAccount.nextPage) {
          navigation.navigate(
            data.validCreateAccount.nextPage as CreateAccountValidPage,
          );
        }
      } else {
        setErrorMsg('Username already exists');
        setReservedUsername('');
        usernameSetValidated(false);
      }
    },
    onError: error => {
      console.log(error);
    },
  });

  const handleNext = async (nextPage: keyof RootStackParamList) => {
    // ✅ Skip re-validation if username was already validated and hasn't changed
    console.log('nextPage', nextPage);
    if (username === '') {
      setErrorMsg('Please write username');
      setActiveInput('username');
      return false;
    }
    if (password === '') {
      setErrorMsg('Please write password');
      setActiveInput('password');
      return false;
    }
    if (rePassword === '') {
      setErrorMsg('Please rewrite password');
      setActiveInput('rePassword');
      return false;
    }
    if (password !== rePassword) {
      setErrorMsg('Passwords not matched. Please write your password again');
      setActiveInput('rePassword');
      return false;
    }
    if (username === reservedUsername && usernameValidated) {
      navigation.navigate(nextPage as CreateAccountValidPage);
      return true;
    }
    await executeQuery({
      variables: {username, nextPage},
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <StepBar
          currentStep={currentStep}
          visitedSteps={visitedSteps}
          onBeforeNavigate={handleNext}
        />
      ),
    });
  }, [
    username,
    reservedUsername,
    usernameValidated,
    password,
    rePassword,
    visitedSteps,
  ]);

  const [activeInput, setActiveInput] = useState<
    'username' | 'password' | 'rePassword'
  >('username');

  return (
    <AuthLayout>
      <View style={{marginBottom: 50}}>
        <TextInput
          placeholder="User Name"
          returnKeyType="next"
          onSubmitEditing={() => setActiveInput('password')}
          placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
          onChangeText={text => handleInputChange(setUsername, text)}
          autoFocus={activeInput === 'username'}
        />
        <TextInput
          placeholder="Password"
          returnKeyType="next"
          onSubmitEditing={() => setActiveInput('rePassword')}
          placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
          onChangeText={text => handleInputChange(setPassword, text)}
          secureTextEntry
          autoFocus={activeInput === 'password'}
        />
        <TextInput
          placeholder="Enter your password again"
          returnKeyType="done"
          placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
          onChangeText={text => handleInputChange(setRePassword, text)}
          lastOne={true}
          secureTextEntry
          autoFocus={activeInput === 'rePassword'}
        />
        {errorMsg !== '' && (
          <Text style={{color: 'red', marginBottom: 10}}>{errorMsg}</Text>
        )}
      </View>
      <View style={{width: '85%', alignSelf: 'center'}}>
        <AuthButton
            text="Next"
            disabled={false}
            loading={loading}
            onPress={() => {
              void handleNext('StepTwo');
            }}
        />
      </View>
    </AuthLayout>
  );
}

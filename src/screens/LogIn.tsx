import {gql, useMutation} from '@apollo/client';
import React, {useEffect, useRef, useState} from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import {useForm} from 'react-hook-form';
import AuthButton from '../components/auth/AuthButton';
import {logUserIn} from '../apollo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../shared/shared.types';
import ErrorMessage from '../components/text/ErrorMessage';

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

type LoginNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'StackLogin'
>;

/* eslint-disable */
const Login = ({route: {params}}: LoginNavigationProps) => {
  const [errorMsg, setErrorMsg] = useState('');

  const {register, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  });

  const handleCompleted = async (data: any) => {
    const {
      login: {ok, token, error},
    } = data;
    if (ok) {

      await logUserIn(token);
    } else {
      console.log('error : ', error);
      setErrorMsg(error || 'Login failed. Please try again.');
    }
  };

  // @ts-ignore
  const onValid = async (data: any) => {
    setErrorMsg('');
    if (!loading) {

      await logInMutation({
        variables: {
          ...data,
        },
      }).then(r => console.log(r));
    }
  };

  const [logInMutation, {loading}] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // @ts-ignore
      void handleCompleted(data);
    },
  });

  // @ts-ignore
  const passwordRef = useRef<any>();

  const onNext = (nextOne: any) => {
    nextOne.current?.focus();
  };

  useEffect(() => {
    register('username', {
      required: true,
    });
    register('password', {
      required: true,
    });
  }, [register]);

  // @ts-ignore
  return (
    <AuthLayout logoMarginTop={150}>
      <TextInput
        value={watch('username')}
        placeholder="Username"
        returnKeyType="next"
        autoCapitalize="none"
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={text => {
          setValue('username', text);
          setErrorMsg('');
        }}
      />
      <TextInput
        value={watch('password')}
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={text => {
          setValue('password', text);
          setErrorMsg('');
        }}
      />
      <AuthButton
          text="Log In"
          loading={loading}
          disabled={!watch('username') || !watch('password')}
          onPress={() => {
            // @ts-ignore
            void handleSubmit(onValid)();
          }}
      />
      {errorMsg ? <ErrorMessage>{errorMsg}</ErrorMessage> : null}
    </AuthLayout>
  );
};

export default Login;

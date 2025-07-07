// App.js
import React, {useEffect, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, {colorModeVar, isLoggedInVar, tokenVar} from './src/apollo';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import {ThemeProvider} from 'styled-components/native';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import LoggedInNav from './src/navigators/LoggedInNav';
import LoggedOutNav from './src/navigators/LoggedOutNav';
import {loadErrorMessages, loadDevMessages} from '@apollo/client/dev';
import {darkTheme, lightTheme} from '@/constants/themes';

export default function App(): React.JSX.Element | null {
  const [ready, setReady] = useState(false);
  const colorMode = useReactiveVar(colorModeVar);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigationRef = useNavigationContainerRef();

  const preload = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      tokenVar(token);
      return true;
    } else {
      tokenVar('');
    }
    return false;
  };

  useEffect(() => {
    preload()
      .then(loggedIn => {
        isLoggedInVar(loggedIn);
        const colorSchemeName: ColorSchemeName = Appearance.getColorScheme();
        colorModeVar(colorSchemeName === 'light' ? 'light' : 'dark');
        setReady(true);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    Appearance.addChangeListener(({colorScheme}) => {
      colorModeVar(colorScheme === 'dark' ? 'dark' : 'light');
    });
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colorMode === 'dark' ? '#000000' : '#FFFFFF',
    },
  };

  if (!ready) return null;

  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={colorMode === 'light' ? lightTheme : darkTheme}>
        <NavigationContainer theme={MyTheme} ref={navigationRef}>
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
}

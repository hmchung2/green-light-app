import {ThemeProvider} from 'styled-components/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {darkTheme, lightTheme} from '@/constants/themes';
import {useEffect, useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import {colorModeVar, isLoggedInVar, tokenVar} from '@/src/apollo';
import {Appearance, ColorSchemeName} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [ready, setReady] = useState<boolean>(false);
  const colorMode: 'light' | 'dark' = useReactiveVar(colorModeVar);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // const isLoggedIn: boolean = useReactiveVar(isLoggedInVar);
  // const navigationRef = useNavigationContainerRef();

  // Preload token and apply initial color mode
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        tokenVar(token);
        isLoggedInVar(true);
      } else {
        tokenVar('');
        isLoggedInVar(false);
      }

      const systemScheme: ColorSchemeName = Appearance.getColorScheme();
      colorModeVar(systemScheme === 'light' ? 'light' : 'dark');
      setReady(true);
    };

    init().catch(console.log);
  }, []);

  // Respond to system theme changes
  useEffect(() => {
    Appearance.addChangeListener(({colorScheme}) => {
      colorModeVar(colorScheme === 'dark' ? 'dark' : 'light');
    });
  }, []);

  if (!loaded || !ready) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider theme={colorMode === 'light' ? lightTheme : darkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

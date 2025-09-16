// constants/themes.ts

import {DefaultTheme} from 'styled-components/native';

export const lightTheme: DefaultTheme = {
  bgColor: 'white',
  fontColor: 'rgb(38, 38, 38)',
  fontWithThemeBackground: '#474747',
  placeholderFontColor: 'rgba(38, 38, 38, 0.6)',
  activeColor: '#0095F6',
  bgContainerColor: '#D3D3D3',
  borderColor: 'black',
  googleLoginColor: 'blue',
  separatorLineColor: 'rgba(38, 38, 38, 0.2)',
  buttonColor: '#2196F3',
  disabledButtonColor: '#CCCCCC',
};

export const darkTheme: DefaultTheme = {
  bgColor: '#000',
  fontColor: 'white',
  fontWithThemeBackground: '#778899',
  placeholderFontColor: 'rgba(255, 255, 255, 0.6)',
  activeColor: '#0095F6',
  bgContainerColor: 'white',
  borderColor: 'white',
  googleLoginColor: 'blue',
  separatorLineColor: 'rgba(255, 255, 255, 0.2)',
  buttonColor: '#0A84FF',
  disabledButtonColor: '#444444',
};

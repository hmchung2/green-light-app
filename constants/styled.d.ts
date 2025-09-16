// constants/styled.d.ts
import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    bgColor: string;
    fontColor: string;
    placeholderFontColor: string;
    fontWithThemeBackground: string;
    activeColor: string;
    bgContainerColor: string;
    borderColor: string;
    googleLoginColor: string;
    separatorLineColor: string;
    buttonColor: string;
    disabledButtonColor: string;
  }
}

export {}; // 안전하게 글로벌 타입 선언임을 보장

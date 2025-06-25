// styles/styled.d.ts
import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    bgColor: string;
    fontColor: string;
    fontWithThemeBackground: string;
    placeHolderFontColor: string;
    activeColor: string;
    bgContainerColor: string;
    borderColor: string;
    googleLoginColor: string;
    separatorLineColor: string;
    buttonColor: string;
    disabledButtonColor: string;
  }
}

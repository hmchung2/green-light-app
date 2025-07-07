import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import {styled} from 'styled-components/native';
import glLogoDark from '@/assets/glLogo-dark.png';
import glLogoLight from '@/assets/glLogo-light.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  logoMarginTop?: number;
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.bgColor};
  padding: 0px 20px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  align-self: center;
`;

export default function AuthLayout({children, logoMarginTop}: AuthLayoutProps) {
  const isDark = useColorScheme() === 'dark';
  const logoSource = isDark ? glLogoDark : glLogoLight;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{flex: 1}}
      onPress={dismissKeyboard}
      disabled={Platform.OS === 'web'}>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: '100%',
            padding: 0,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Logo
            resizeMode="contain"
            source={logoSource}
            style={{marginTop: logoMarginTop ? logoMarginTop : 25}}
          />
          <View style={{flex: 3}}>{children}</View>
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
}

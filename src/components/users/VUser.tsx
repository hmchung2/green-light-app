import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import AvatarImg from './AvatarImg.tsx';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../shared/shared.types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface VUserProps {
  avatar: string;
  username: string;
  id: number;
}

const Container = styled.View`
  align-items: center;
`;

const UserName = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

type RoomItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function VUser({avatar, username, id}: VUserProps) {
  const navigation = useNavigation<RoomItemNavigationProps>();

  const goToProfile = () => {
    navigation.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {
        id: id,
      },
    });
  };

  return (
    <TouchableOpacity onPress={() => goToProfile()}>
      <Container>
        <AvatarImg avatarPath={avatar} />
        <UserName>
          {username.slice(0, 10)}
          {username.length > 10 ? '...' : null}
        </UserName>
      </Container>
    </TouchableOpacity>
  );
}

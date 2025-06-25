import {colors} from '../../colors';
import styled from 'styled-components/native';
import useMe from '../../hooks/useMe';
import {useNavigation} from '@react-navigation/core';
import AvatarImg from '../users/AvatarImg.tsx';
import {RootStackParamList, User} from '../../shared/shared.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
type RoomItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface RoomItemProps {
  users: User[];
  unreadTotal: number;
  id: number;
  lastMessage?: {
    id: number;
    payload: string;
    read: boolean;
    user: {
      id: number;
      username: string;
      avatar: string;
    };
    createdAt: string;
  } | null;
}

const RoomContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Data = styled.View``;
const UnreadDot = styled.View`
  width: 10px;
  border-radius: 5px;
  height: 10px;
  background-color: ${colors.blue};
`;
const Username = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 600;
  font-size: 16px;
`;
const UnreadText = styled.Text`
  color: ${props => props.theme.fontColor};
  margin-top: 2px;
  font-weight: 500;
`;

const LastMessageText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 14px;
  font-weight: 400;
`;

const UnreadCountText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
`;

export default function RoomItem({
  users,
  unreadTotal,
  id,
  lastMessage,
}: RoomItemProps) {
  const {data: meData} = useMe();

  const navigation = useNavigation<RoomItemNavigationProps>();

  const targetUser: User = users.find(
    user => user.username !== meData?.me?.username,
  )!;

  const goToRoom = () =>
    navigation.navigate('EachRoom', {
      id: id,
      talkingTo: targetUser.username,
    });

  if (__DEV__) {
    console.log(`🔹 Room ID: ${id}`);
    console.log('👤 Target User:', targetUser);
    console.log('📝 Last Message:', lastMessage);
    console.log(`📩 Unread Total: ${unreadTotal}`);
  }

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <AvatarImg avatarPath={targetUser?.avatar} />
        <Data>
          <Username>{targetUser?.username}</Username>
          <LastMessageText>
            {lastMessage?.payload ? lastMessage.payload : 'No messages yet'}
          </LastMessageText>
          {unreadTotal !== 0 && (
            <UnreadCountText>
              {unreadTotal} unread {unreadTotal === 1 ? 'message' : 'messages'}
            </UnreadCountText>
          )}
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 ? <UnreadDot /> : null}</Column>
    </RoomContainer>
  );
}

import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

interface AlarmItemImgProps {
  alarmType: number;
  alarmImgUrl: string | null | undefined;
  size?: number;
  glow?: boolean;
}

const AvatarImage = styled.Image<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  margin: 10px 10px 1px 10px;
`;

const Type1Container = styled.View<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  background-color: grey;
  margin: 10px 10px 1px 10px;
  justify-content: center;
  align-items: center;
`;

const DefaultContainer = styled.View<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  margin: 10px 10px 1px 10px;
  justify-content: center;
  align-items: center;
`;

export default function AlarmItemImg({
  alarmType,
  alarmImgUrl,
  size = 50,
  glow = false,
}: AlarmItemImgProps) {
  const avatarStyle = glow
    ? {
        borderColor: 'red',
        borderRadius: 3,
        borderWidth: 1,
      }
    : {};
  const renderAlarmContent = () => {
    switch (alarmType) {
      case 1:
        return alarmImgUrl ? (
          <AvatarImage
            source={{uri: alarmImgUrl}}
            size={size}
            style={avatarStyle}
          />
        ) : (
          <Type1Container size={size} style={avatarStyle}>
            <Icon name="person" size={size * 0.64} color="#ffffff" />
          </Type1Container>
        );
      default:
        return (
          <DefaultContainer size={size} style={avatarStyle}>
            <Icon name={'alarm-outline'} size={20} />
          </DefaultContainer>
        );
    }
  };
  return renderAlarmContent();
}

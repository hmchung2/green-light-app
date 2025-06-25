import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AvatarImgProps {
  avatarPath: string | null | undefined;
  size?: number; // Optional size parameter
}

const AvatarImage = styled.Image<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  margin: 10px 10px 1px 10px;
`;

const IconContainer = styled.View<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  background-color: grey;
  margin: 10px 10px 1px 10px;
  justify-content: center;
  align-items: center;
`;

export default function AvatarImg({avatarPath, size = 50}: AvatarImgProps) {
  return avatarPath ? (
    <AvatarImage source={{uri: avatarPath}} size={size} />
  ) : (
    <IconContainer size={size}>
      <Icon name="person" size={size * 0.64} color="#ffffff" />
    </IconContainer>
  );
}

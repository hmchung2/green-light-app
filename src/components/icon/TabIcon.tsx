import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {View} from 'react-native';

interface TabIconProps {
  iconName: 'link' | 'heart' | 'map' | 'person' | 'chatbox-ellipses' | 'alarm';
  color: string;
  focused: boolean;
}
const IconBadge = styled.View`
  width: 18px;
  height: 18px;
  borderradius: 8px;
  backgroundcolor: 'red';
  justifycontent: 'center';
  alignitems: 'center';
`;

const IconContainer = styled.View``;

export default function TabIcon({iconName, color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={22}
    />
  );
}

import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from 'styled-components';
import {RootStackParamList} from '../shared/shared.types.ts';
import EmptyScreen from '../screens/EmptyScreen.tsx';

const TopTabs = createMaterialTopTabNavigator<RootStackParamList>();

export default function MatchTabNav() {
  const theme = useTheme();

  return (
    <TopTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.bgColor,
          borderTopColor: theme.fontColor,
        },
        tabBarActiveTintColor: theme.fontColor,
        tabBarInactiveTintColor: 'red',
      }}>
      <TopTabs.Screen name="MyProfile" component={EmptyScreen} />
      <TopTabs.Screen name="FollowingInner" component={EmptyScreen} />
    </TopTabs.Navigator>
  );
}

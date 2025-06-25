import React from 'react';
import TabsNav from './TabsNav';
import MessagesNav from './MessagesNav';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'styled-components';
import StackProfileNav from './StackProfileNav.tsx';
import {RootStackParamList} from '../shared/shared.types.ts';
import {NotificationProvider} from '../hooks/NotificiationContext.tsx';
import GreenLightAlarm from '../screens/Alarms/GreenLightAlarm.tsx';
import MatchTabNav from './MatchTabNav.tsx';

const Nav = createStackNavigator<RootStackParamList>();

export default function LoggedInNav() {
  const theme = useTheme();

  return (
    <NotificationProvider>
      <Nav.Navigator
        screenOptions={{
          cardStyle: {backgroundColor: theme.bgColor},
          animationEnabled: false,
          headerStyle: {
            backgroundColor: theme.bgColor,
          },
          headerTitleStyle: {
            color: theme.fontColor,
          },
          headerTintColor: theme.fontColor,
        }}>
        <Nav.Screen
          name="TabNav"
          options={{headerShown: false}}
          // Pass MyTheme object as a prop to TabsNav component
          component={TabsNav}
        />
        <Nav.Screen
          name="MatchTabNav"
          options={{headerShown: false}}
          component={MatchTabNav}
        />
        <Nav.Screen
          name="StackMessagesNav"
          options={{headerShown: false}}
          component={MessagesNav}
        />
        <Nav.Screen
          name="StackProfileNav"
          options={{headerShown: false}}
          component={StackProfileNav}
        />
        <Nav.Screen
          name="GreenLightAlarm"
          options={{headerShown: false}}
          component={GreenLightAlarm}
        />
      </Nav.Navigator>
    </NotificationProvider>
  );
}

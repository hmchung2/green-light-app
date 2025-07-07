import {colorModeVar} from '../apollo';
import {useReactiveVar} from '@apollo/client';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfile from '../screens/Profiles/EditProfile';
import SimpleProfile from '../screens/Profiles/SimpleProfile';
import {RootStackParamList} from '../shared/shared.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import Matches from '../screens/Profiles/Matches';
import Following from '../screens/Profiles/Following';
import MatchTabNav from './MatchTabNav';

const Stack = createStackNavigator<RootStackParamList>();

type StackProfileNavProps = NativeStackScreenProps<
  RootStackParamList,
  'StackProfileNav'
>;

const StackProfileNav = ({navigation, route}: StackProfileNavProps) => {
  console.log('profile stackNav route : ', route);

  const isDarkMode: 'light' | 'dark' = useReactiveVar(colorModeVar);

  useEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode === 'light' ? 'white' : 'black',
        },
        headerTintColor: isDarkMode === 'light' ? 'black' : 'white',
      }}>
      {/*  here it needs to go to message nav. its in wrong navigation*/}
      <Stack.Screen
        name="SimpleProfile"
        component={SimpleProfile}
        initialParams={route.params}
        options={{
          headerTitle: '', // Initially empty
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerTitle: 'Edit Profile'}}
      />
      <Stack.Screen
        name={'MatchesTab'}
        component={MatchTabNav}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackProfileNav;

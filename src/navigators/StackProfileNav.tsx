import {colorModeVar} from '../apollo';
import {useReactiveVar} from '@apollo/client';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfile from '../screens/Profiles/EditProfile.tsx';
import SimpleProfile from '../screens/Profiles/SimpleProfile.tsx';
import {RootStackParamList} from '../shared/shared.types.ts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import React from 'react';
import Matches from '../screens/Profiles/Matches.tsx';
import Following from '../screens/Profiles/Following.tsx';
import MatchTabNav from './MatchTabNav.tsx';

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
        headerBackTitleVisible: false,
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
        name={'Matches'}
        options={{headerShown: false}}
        component={Matches}
      />
      <Stack.Screen
        name={'Following'}
        component={Following}
        options={{headerTitle: 'Following'}}
      />

      <Stack.Screen
        name={'MatchesTab'}
        component={MatchTabNav}
        options={{headerTitle: 'Connections'}}
      />
    </Stack.Navigator>
  );
};

export default StackProfileNav;

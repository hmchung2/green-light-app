import React from 'react';
import {View, StatusBar, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from 'styled-components/native';
import Matches from '@/src/screens/Profiles/Matches';
import Following from '@/src/screens/Profiles/Following';

const TopTabs = createMaterialTopTabNavigator();

export default function MatchTabNav() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: theme.bgColor,
      }}>
      <TopTabs.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'capitalize',
            color: theme.fontColor,
          },
          tabBarStyle: {
            backgroundColor: theme.bgColor,
            borderBottomWidth: 1,
            borderBottomColor: theme.separatorLineColor,
            elevation: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.fontColor,
            height: 2,
          },
        }}>
        <TopTabs.Screen name="Matches" component={Matches} />
        <TopTabs.Screen name="Following" component={Following} />
      </TopTabs.Navigator>
    </View>
  );
}

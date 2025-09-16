import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmptyScreen from '../screens/EmptyScreen';
import TabIcon from '../components/icon/TabIcon';
import {useTheme} from 'styled-components/native';
import MapScreen from '../screens/MapScreen';
import {RootStackParamList} from '../shared/shared.types';
import Alarms from '../screens/Alarms/Alarms';
import {useNotifications} from '../hooks/NotificiationContext';
import {useAlarmUpdatesSubscription} from '../generated/graphql';
import {Reference, StoreObject, gql, useApolloClient} from '@apollo/client';
import MyProfile from '../screens/Profiles/MyProfile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const Tabs = createBottomTabNavigator<RootStackParamList>();


const ALARM_FRAGMENT = gql`
  fragment AlarmDetails on Alarm {
    id
    __typename
    alarmImg
    alarmType
    createdAt
    detail
    msg
    read
    seen
    targetId
    updatedAt
  }
`;

const READ_ALARMS_QUERY = gql`
  query ReadAlarmsResponse {
    readAlarmsResponse {
      id
      __typename
      endPage
      result {
        __ref
      }
    }
  }
`;

export default function TabsNav() {
  const theme = useTheme();
  const {hasUnSeenAlarms, setHasUnSeenAlarms} = useNotifications();
  console.log('hasUnSeenAlarms >>> ', hasUnSeenAlarms);
  const client = useApolloClient();
  const {
    data: newAlarmData,
    loading: newAlarmDataLoading,
    error: newAlarmError,
  } = useAlarmUpdatesSubscription();

  console.log('newAlarmData >>> ', newAlarmData);

  useEffect(() => {
    if (newAlarmData?.alarmUpdates) {
      const newAlarm = newAlarmData.alarmUpdates;

      // Create a cache ID for the new alarm
      const newAlarmCacheId = `Alarm:${newAlarm.id}`;

      // Write the new alarm to the cache
      client.cache.writeFragment({
        id: newAlarmCacheId,
        fragment: ALARM_FRAGMENT,
        data: newAlarm,
      });

      try {
        client.cache.modify({
          id: 'ReadAlarmsResponse:1',
          fields: {
            result(existingRefs, {readField}) {
              const newAlarmRef = client.cache.writeFragment({
                data: newAlarm,
                fragment: ALARM_FRAGMENT,
              });

              if (
                existingRefs.some(
                  (ref: any) => readField('id', ref) === newAlarm.id,
                )
              ) {
                return existingRefs;
              }
              return [newAlarmRef, ...existingRefs];
            },
          },
        });

        // Update the component state or trigger any other side effects
        setHasUnSeenAlarms(true);
      } catch (error) {
        console.error('Error updating the cache for new alarms:', error);
      }
    }
  }, [newAlarmData, client, setHasUnSeenAlarms]);

  return (
    <Tabs.Navigator
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
      <Tabs.Screen
        name="Matches"
        component={EmptyScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              iconName={'heart'}
              color={theme.fontColor}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              iconName={'map'}
              color={theme.fontColor}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              iconName={'person'}
              color={theme.fontColor}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Chats"
        component={EmptyScreen}
        listeners={({navigation}) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate('StackMessagesNav');
          },
        })}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              iconName={'chatbox-ellipses'}
              color={theme.fontColor}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Alarms"
        component={Alarms}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              iconName={'alarm'}
              color={theme.fontColor}
              focused={focused}
            />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.bgColor,
          },
          headerTitleStyle: {
            color: theme.fontColor,
          },
          tabBarBadge: hasUnSeenAlarms ? '' : undefined,
          tabBarBadgeStyle: {
            height: 14,
            minWidth: 14,
            borderRadius: 7,
          },
        }}
      />
    </Tabs.Navigator>
  );
}

import React, {useRef, useEffect, useState} from 'react';
import {View, Platform, DrawerLayoutAndroid} from 'react-native';
import * as Location from 'expo-location';
import RealTimeMap from '../components/map/RealTimeMap';
import SideBar from '../components/map/SideBar';
import {User} from '../generated/graphql';
import styled from 'styled-components/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const SideBarButton = styled.TouchableOpacity`
  position: absolute;
  top: 50%;
  right: 0px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
`;

const SidebarButtonText = styled.Text`
  font-size: 18px;
  color: blue;
`;

export default function MapScreen() {
  const [initialLocation, setInitialLocation] = useState<LocationCoords | null>(
    null,
  );
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const drawerRef = useRef<DrawerLayoutAndroid | null>(null);
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setInitialLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.error('Error getting location:', err);
      }
    };

    requestLocationPermission();
  }, []);

  const handleEndReached = () => {
    if (!isLoading) {
      // Load more user data
    }
  };

  const openSidebar = () => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
    } else {
      console.log('drawerRef.current is null');
    }
  };

  const closeSidebar = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <SideBar
          currentUsers={currentUsers}
          isLoading={isLoading}
          onClose={() => props.navigation.closeDrawer()}
          onEndReached={handleEndReached}
        />
      )}
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {width: 200},
      }}>
      <Drawer.Screen
        name="MapMainScreen"
        options={{
          headerShown: false,
        }}>
        {props => (
          <View style={{flex: 1}}>
            {initialLocation && (
              <RealTimeMap
                initialLatitude={initialLocation.latitude}
                initialLongitude={initialLocation.longitude}
                setCurrentUsers={setCurrentUsers}
              />
            )}
            <SideBarButton onPress={() => props.navigation.openDrawer()}>
              <SidebarButtonText>{'<'}</SidebarButtonText>
            </SideBarButton>
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

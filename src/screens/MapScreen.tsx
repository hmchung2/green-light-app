import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  DrawerLayoutAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RealTimeMap from '../components/map/RealTimeMap.tsx';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SideBar from '../components/map/SideBar.tsx';
import {User} from '../generated/graphql.ts';
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
  const [isLoading, setIsLoading] = useState<boolean>(false); // 추가 데이터 로딩 상태

  const drawerRef = useRef<DrawerLayoutAndroid | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let granted;
        if (Platform.OS === 'ios') {
          granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
          granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
        }
        Geolocation.getCurrentPosition(
          position => {
            console.log('Getting data');
            setInitialLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.error('Error getting location:', error);
          },
        );
      } catch (err) {
        console.error('권한 오류:', err); // 구글 API 키 넣어야 함()
      }
    };
    requestLocationPermission();
  }, []);

  // 스크롤 끝에 도달했을 때 추가 데이터 로드
  const handleEndReached = () => {
    if (!isLoading) {
    }
  };

  const openSidebar = () => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
    } else {
      console.log('drawerRef.current is null');
    }
  };

  // 사이드바 닫기
  const closeSidebar = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
    }
  };
  const Drawer = createDrawerNavigator();

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
          headerShown: false, // Ensures the header is hidden for this specific screen
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

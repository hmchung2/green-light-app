import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MapScreen from '../screens/MapScreen.tsx';
import SideBar from '../components/map/SideBar.tsx';

const Drawer = createDrawerNavigator();

export default function MapDrawerNavigator() {
  return (
    // <Drawer.Navigator
    //   drawerContent={props => <SideBar {...props} />}
    //   drawerPosition="right">
    //   <Drawer.Screen name="MapScreen" component={MapScreen} />
    // </Drawer.Navigator>
    null
  );
}

import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Circle, Region} from 'react-native-maps';
import {customMapStyle} from '../../../constants/mapStyle.ts';
import {ApolloClient, useApolloClient, useQuery} from '@apollo/client';
import {MAP_UPDATES} from '../../documents/subscriptions/mapUpdates.subscription.ts';
import {
  Location,
  SelectLocationsQuery,
  UpdateLocationMutation,
  User,
  useUpdateLocationMutation,
} from '../../generated/graphql.ts';
import MapScreenLayout from './MapScreenLayOut.tsx';
import {LOCATION_FRAGMENT} from '../../fragments.tsx';
import gql from 'graphql-tag';
import Geolocation from '@react-native-community/geolocation';
import {Animated, View, PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {colors} from '../../colors.ts';

interface RealTimeMapProps {
  initialLatitude: number;
  initialLongitude: number;
  setCurrentUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

interface RealTimeLocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationDataProps {
  selectLocations: {
    id: number;
    locations: Array<Location> | null;
  };
}

const SEE_LOCATIONS_QUERY = gql`
  query SelectLocations($lat: Float!, $lon: Float!) {
    selectLocations(lat: $lat, lon: $lon) {
      id
      locations {
        ...LocationParts
      }
    }
  }
  ${LOCATION_FRAGMENT}
`;

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

export default function RealTimeMap({
  initialLatitude,
  initialLongitude,
  setCurrentUsers,
}: RealTimeMapProps) {
  const checkingDigits: number = 4;
  const rerenderThreshHold: number = 0.03;
  const client: ApolloClient<Object> = useApolloClient();
  const [subscribed, setSubscribed] = useState(false);

  const [opacityAnim] = useState(new Animated.Value(1));

  const parse = (num: number): number => {
    return parseFloat(num.toFixed(checkingDigits));
  };

  const [realTimeLocation, setRealTimeLocation] =
    useState<RealTimeLocationCoords>({
      latitude: parse(initialLatitude),
      longitude: parse(initialLongitude),
    });

  const [lastSelectPoint, setLastSelectPoint] =
    useState<RealTimeLocationCoords>({
      latitude: parse(initialLatitude),
      longitude: parse(initialLongitude),
    });

  const realTimeLocationRef = useRef(realTimeLocation);
  realTimeLocationRef.current = realTimeLocation;

  // const {
  //   data: realTimeData,
  //   loading: realTimeLoading,
  //   error: realTimeError,
  // } = useSubscription(MAP_UPDATES, {
  //   variables: {
  //     generalLat: latitude,
  //     generalLon: longitude,
  //   },
  // });

  const {
    data: locationData,
    loading: initialLoading,
    refetch,
    subscribeToMore,
  } = useQuery<LocationDataProps>(SEE_LOCATIONS_QUERY, {
    variables: {
      lat: parse(initialLatitude),
      lon: parse(initialLongitude),
    },
    fetchPolicy: 'network-only',
  });

  const initialRegion: Region = {
    latitude: initialLatitude || 0,
    longitude: initialLongitude || 0,
    latitudeDelta: 0.005, // Smaller delta values for higher zoom
    longitudeDelta: 0.005,
  };

  // useEffect(() => {
  //   if (locationData) {
  //     console.log('locationData from here:', locationData);
  //     client.writeQuery({
  //       query: SEE_LOCATIONS_QUERY,
  //       data: locationData,
  //       variables: {lat: initialLatitude, lon: initialLongitude},
  //     });
  //   }
  // }, [locationData, initialLatitude, initialLongitude, client]);

  const [updateLocationMutation, {loading: updatingLocation}] =
    useUpdateLocationMutation({
      onCompleted: (data: UpdateLocationMutation): void => {},
    });

  // const {
  //   data: subscriptionData,
  //   loading: subscriptionLoading,
  //   error: subscriptionError,
  // } = useSubscription(MAP_UPDATES, {
  //   variables: {
  //     generalLat: initialLatitude,
  //     generalLon: 55,
  //   },
  // });

  useEffect(() => {
    if (locationData && !subscribed) {
      console.log(
        'subscribed to more!!!!!!!!!!!!!!!!!!! ',
        initialLatitude,
        ' : ',
        initialLongitude,
      );
      subscribeToMore({
        document: MAP_UPDATES,
        variables: {
          generalLat: initialLatitude,
          generalLon: initialLongitude,
        },
        updateQuery: (prevQuery: SelectLocationsQuery, options: any): any => {
          // console.log('update Query : ', options);
          const {
            subscriptionData: {
              data: {mapUpdates: realTimeLocation},
            },
          } = options;
          console.log('realTimeLocation.userId  : ', realTimeLocation);
          const locationFragment = client.cache.writeFragment({
            fragment: LOCATION_FRAGMENT,
            data: realTimeLocation,
          });
          console.log('locationFragment : ', locationFragment);
          const cacheId = client.cache.identify({
            __typename: 'Location',
            userId: realTimeLocation.userId,
          });
          console.log(`LocationRoom:${locationData.selectLocations.id}`);
          client.cache.modify({
            id: `LocationRoom:${locationData.selectLocations.id}`,
            fields: {
              locations(prev) {
                const existingLocation = prev.find(
                  (aLocation: any) => aLocation.__ref === cacheId,
                );
                console.log('existingLocation : ', existingLocation);
                console.log(
                  'locationFragment.__ref : ',
                  locationFragment?.__ref,
                );
                if (existingLocation) {
                  return prev;
                }
                return [...prev, locationFragment];
              },
            },
          });
        },
      });
      setSubscribed(true);
    } else {
      console.log('Already Subscribed !!!!!!!!!!!!!!!!!!');
    }
    if (locationData?.selectLocations) {
      console.log('location data : ', locationData);
      const locationsList = locationData.selectLocations.locations;
      if (locationsList) {
        const users = locationsList.map(location => location.user);
        setCurrentUsers(users);
      }
    }
  }, [locationData, subscribed]);

  useEffect(() => {
    console.log('Starting Real Time Map@@@@@@@@');
    let watchId: number | null = null;
    const watchRealTime = async () => {
      console.log('watch started');
      if (Platform.OS === 'ios') {
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }

      watchId = Geolocation.watchPosition(
        position => {
          const currentLocation = {
            latitude: parse(position.coords.latitude),
            longitude: parse(position.coords.longitude),
          };
          if (
            currentLocation.latitude !== realTimeLocationRef.current.latitude ||
            currentLocation.longitude !== realTimeLocationRef.current.longitude
          ) {
            console.log('setting Realtime');
            console.log(
              currentLocation.latitude +
                ' vs ' +
                realTimeLocationRef.current.latitude,
            );
            console.log(
              currentLocation.longitude +
                ' vs ' +
                realTimeLocationRef.current.longitude,
            );
            setRealTimeLocation(currentLocation);
          }
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, distanceFilter: 0},
      );
    };
    watchRealTime();
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    console.log('Updated realTimeLocation : ', realTimeLocation);
    if (!updatingLocation) {
      console.log('sending data');
      updateLocationMutation({
        variables: {
          lat: realTimeLocation.latitude,
          lon: realTimeLocation.longitude,
        },
      }).catch(error => console.log(error));
      if (
        Math.abs(realTimeLocation.latitude - lastSelectPoint.latitude) >
          rerenderThreshHold ||
        Math.abs(realTimeLocation.longitude - lastSelectPoint.longitude) >
          rerenderThreshHold
      ) {
        console.log('moved too much -> selecting near by again');
        refetch({
          lat: realTimeLocation.latitude,
          lon: realTimeLocation.longitude,
        }).catch(error => console.log('error : ', error));
        setLastSelectPoint({
          latitude: realTimeLocation.latitude,
          longitude: realTimeLocation.longitude,
        });
      }
    } else {
      console.log('already sending');
    }
  }, [realTimeLocation]);

  useEffect(() => {
    if (initialLoading) {
      console.log('Fetching near by users');
    }
  }, [initialLoading]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacityAnim]);

  return (
    <MapScreenLayout loading={initialLoading}>
      <MapView
        style={{flex: 1}}
        // camera={{
        //   center: initialRegion, // initialRegion should have latitude and longitude
        //   pitch: 0, // 0 for looking straight down
        //   heading: userHeading, // Dynamically update this based on the user's current heading
        //   altitude: initialAltitude, // Set an initial altitude
        //   zoom: 20, // Adjust the zoom level as needed
        // }}
        region={initialRegion}
        showsUserLocation={true}
        customMapStyle={customMapStyle}
        zoomEnabled={false} // Disables zooming
        scrollEnabled={false} // Disables panning
        pitchEnabled={false} // Disables pitch tilt
        rotateEnabled={true} // Disables rotation
      >
        {locationData &&
          locationData.selectLocations &&
          locationData.selectLocations.locations &&
          locationData.selectLocations.locations.map(location => {
            if (location.lat && location.lon) {
              return (
                <AnimatedMarker
                  key={location.userId}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lon,
                  }}
                  style={{opacity: opacityAnim}}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: colors.green,
                    }}
                  />
                </AnimatedMarker>
              );
            }
          })}
      </MapView>
    </MapScreenLayout>
  );
}

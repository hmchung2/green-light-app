import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Circle, Region} from 'react-native-maps';
import {customMapStyle} from '../../../constants/mapStyle';
import {ApolloClient, useApolloClient, useQuery} from '@apollo/client';
import {MAP_UPDATES} from '../../documents/subscriptions/mapUpdates.subscription';
import {
  UpdateLocationMutation,
  Location,
  SelectLocationsQuery,
  User,
  useUpdateLocationMutation,
} from '../../generated/graphql';
import MapScreenLayout from './MapScreenLayOut';
import {LOCATION_FRAGMENT} from '../../fragments';
import {gql} from 'graphql-tag';
import {Animated, View} from 'react-native';
import {colors} from '../../colors';
import * as ExpoLocation from 'expo-location';

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
    locations: Location[] | null;
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
  const checkingDigits = 4;
  const rerenderThreshHold = 0.03;
  const client: ApolloClient<object> = useApolloClient();
  const [subscribed, setSubscribed] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(1));

  const parse = (num: number): number =>
    parseFloat(num.toFixed(checkingDigits));

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

  const [updateLocationMutation, {loading: updatingLocation}] =
    useUpdateLocationMutation({
      onCompleted: (data: UpdateLocationMutation): void => {},
    });

  const initialRegion: Region = {
    latitude: initialLatitude || 0,
    longitude: initialLongitude || 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  useEffect(() => {
    if (locationData && !subscribed) {
      subscribeToMore({
        document: MAP_UPDATES,
        variables: {
          generalLat: initialLatitude,
          generalLon: initialLongitude,
        },
        updateQuery: (prevQuery: SelectLocationsQuery, options: any): any => {
          const {
            subscriptionData: {
              data: {mapUpdates: realTimeLocation},
            },
          } = options;

          const locationFragment = client.cache.writeFragment({
            fragment: LOCATION_FRAGMENT,
            data: realTimeLocation,
          });

          const cacheId = client.cache.identify({
            __typename: 'Location',
            userId: realTimeLocation.userId,
          });

          client.cache.modify({
            id: `LocationRoom:${locationData.selectLocations.id}`,
            fields: {
              locations(prev = []) {
                const alreadyExists = prev.some(
                  (aLocation: any) => aLocation.__ref === cacheId,
                );
                if (alreadyExists) return prev;
                return [...prev, locationFragment];
              },
            },
          });
        },
      });
      setSubscribed(true);
    }

    if (locationData?.selectLocations?.locations) {
      const users = locationData.selectLocations.locations.map(loc => loc.user);
      setCurrentUsers(users);
    }
  }, [locationData, subscribed]);

  useEffect(() => {
    let locationSubscription: ExpoLocation.LocationSubscription | null = null;

    const startWatchingLocation = async () => {
      const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      locationSubscription = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          distanceInterval: 1, // meters
          timeInterval: 1000, // ms
        },
        location => {
          const currentLocation = {
            latitude: parse(location.coords.latitude),
            longitude: parse(location.coords.longitude),
          };

          if (
            currentLocation.latitude !== realTimeLocationRef.current.latitude ||
            currentLocation.longitude !== realTimeLocationRef.current.longitude
          ) {
            setRealTimeLocation(currentLocation);
          }
        },
      );
    };

    startWatchingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!updatingLocation) {
      updateLocationMutation({
        variables: {
          lat: realTimeLocation.latitude,
          lon: realTimeLocation.longitude,
        },
      }).catch(console.error);

      const movedTooFar =
        Math.abs(realTimeLocation.latitude - lastSelectPoint.latitude) >
          rerenderThreshHold ||
        Math.abs(realTimeLocation.longitude - lastSelectPoint.longitude) >
          rerenderThreshHold;

      if (movedTooFar) {
        refetch({
          lat: realTimeLocation.latitude,
          lon: realTimeLocation.longitude,
        }).catch(console.error);
        setLastSelectPoint(realTimeLocation);
      }
    }
  }, [realTimeLocation]);

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
        region={initialRegion}
        showsUserLocation={true}
        customMapStyle={customMapStyle}
        zoomEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={true}>
        {locationData?.selectLocations?.locations?.map(location =>
          location.lat && location.lon ? (
            <AnimatedMarker
              key={location.userId}
              coordinate={{latitude: location.lat, longitude: location.lon}}
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
          ) : null,
        )}
      </MapView>
    </MapScreenLayout>
  );
}

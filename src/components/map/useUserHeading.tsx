import {useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
// Assuming you have a library or method to get compass heading
// @ts-ignore
import {getCompassHeading} from 'your-compass-heading-library';

const useUserHeading = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'headingUpdated',
      data => {
        setHeading(data.newHeading);
      },
    );

    getCompassHeading().start(); // Start listening for heading updates

    return () => {
      subscription.remove();
      getCompassHeading().stop(); // Stop listening when the component unmounts
    };
  }, []);

  return heading;
};

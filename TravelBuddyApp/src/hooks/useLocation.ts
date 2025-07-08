import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { TravelMode } from '@/types';

export const useLocation = (travelMode: TravelMode) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 30,
    longitudeDelta: 30,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: travelMode === "car" ? 0.5 : 0.05,
          longitudeDelta: travelMode === "car" ? 0.5 : 0.05,
        });
      } catch (error) {
        setErrorMsg('Failed to get current location');
        console.error(error);
      }
    })();
  }, [travelMode]);

  return { location, errorMsg, region };
}; 
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { TravelMode } from '@/types';
import { haversineDistance } from '@/utils/distanceCalculator';

const UPDATE_INTERVAL = 10000; // 10 seconds
const SIGNIFICANT_DISTANCE_THRESHOLD = 500; // 500 meters

export const useLocation = (travelMode: TravelMode) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 30,
    longitudeDelta: 30,
  });

  const lastFetchedLocation = useRef<Location.LocationObject | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);


  useEffect(() => {
    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: UPDATE_INTERVAL,
            distanceInterval: 100, // receive update every 100 meters
          },
          (newLocation) => {
            if (!lastFetchedLocation.current) {
                // First location update
                setLocation(newLocation);
        setRegion({
                    latitude: newLocation.coords.latitude,
                    longitude: newLocation.coords.longitude,
          latitudeDelta: travelMode === "car" ? 0.5 : 0.05,
          longitudeDelta: travelMode === "car" ? 0.5 : 0.05,
        });
                lastFetchedLocation.current = newLocation;
            } else {
                const distance = haversineDistance(
                    { latitude: lastFetchedLocation.current.coords.latitude, longitude: lastFetchedLocation.current.coords.longitude },
                    { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude }
                );

                if (distance > SIGNIFICANT_DISTANCE_THRESHOLD) {
                    setLocation(newLocation);
                    lastFetchedLocation.current = newLocation;
                }
            }
          }
        );
      } catch (error) {
        setErrorMsg('Failed to start watching location');
        console.error(error);
      }
    };
    
    startWatching();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if(location){
        setRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: travelMode === "car" ? 0.5 : 0.05,
            longitudeDelta: travelMode === "car" ? 0.5 : 0.05,
        }));
    }
  }, [travelMode, location]);

  return { location, errorMsg, region };
}; 
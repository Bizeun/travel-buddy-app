import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { MarkerData, Place, Restaurant } from '@/types';
import { Colors } from '@/constants/Colors';
import CustomCallout from './CustomCallout';
import { useFavorites } from '@/hooks/useFavorites';

interface MapMarkerProps {
  place: Place;
  onPress: () => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
}

const isRestaurant = (place: Place): place is Restaurant => {
  return 'category' in place;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ place, onPress, onFavoriteToggle, isFavorite }) => {
  
  const getMarkerColor = () => {
    return isRestaurant(place) ? Colors.light.secondary : Colors.light.primary;
  };

  return (
    <Marker
      coordinate={place.coord}
      pinColor={getMarkerColor()}
      onPress={onPress}
    >
      <Callout tooltip>
        <CustomCallout
          title={place.name}
          distance={place.distance}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
        />
      </Callout>
    </Marker>
  );
};

export default MapMarker;

const styles = StyleSheet.create({
    calloutContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderColor: Colors.light.tint,
        borderWidth: 1,
        width: 200,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    }
}) 
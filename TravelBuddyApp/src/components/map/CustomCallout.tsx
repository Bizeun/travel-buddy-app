import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Place } from '@/types';
import { IconSymbol } from '../ui/IconSymbol';

interface CustomCalloutProps {
  place: Place;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  parkingInfo?: string;
}


const isRestaurant = (place: Place): place is Place & { rating: number } => 'rating' in place;

const CustomCallout: React.FC<CustomCalloutProps> = ({
  place,
  isFavorite,
  onFavoriteToggle,
}) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{place.name}</Text>
        <Pressable onPress={onFavoriteToggle} style={styles.favoriteButton}>
          <IconSymbol
            name={isFavorite ? 'heart.fill' : 'heart'}
            size={24}
            color={isFavorite ? Colors.light.tint : Colors.light.text}
          />
        </Pressable>
      </View>
        {isRestaurant(place) && place.rating && (
          <Text style={styles.details}>Rating: {place.rating}</Text>
        )}
        {place.formatted_address && (
          <Text style={styles.details} numberOfLines={2}>{place.formatted_address}</Text>
        )}
        {place.opening_hours && (
          <Text style={[
            styles.details, 
            { color: place.opening_hours?.open_now ? 'green' : 'red' }
          ]}>
            {place.opening_hours?.open_now ? 'Open Now' : 'Closed'}
          </Text>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    borderColor: Colors.light.tint,
    borderWidth: 2,
    width: 250,height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    color: Colors.light.text,
  },
  favoriteButton: {
    paddingLeft: 10,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,

  },
  parking: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default CustomCallout; 
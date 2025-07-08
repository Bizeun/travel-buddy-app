import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface CustomCalloutProps {
  title: string;
  description?: string;
  distance?: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  parkingInfo?: string;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({
  title,
  description,
  distance,
  isFavorite,
  onFavoriteToggle,
  parkingInfo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onFavoriteToggle} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.light.tint : Colors.light.text}
          />
        </TouchableOpacity>
      </View>
      {description && <Text style={styles.description}>{description}</Text>}
      {distance !== undefined && (
        <Text style={styles.distance}>
          Distance: {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
        </Text>
      )}
      {parkingInfo && <Text style={styles.parking}>Parking: {parkingInfo}</Text>}
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
    width: 250,
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
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  parking: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default CustomCallout; 
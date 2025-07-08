import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FilterType } from '@/types';

interface LegendProps {
  showLegend: boolean;
  onToggle: () => void;
}

const LEGEND_ITEMS: { label: string; color: string; type: FilterType }[] = [
  { label: 'Attractions', color: Colors.light.primary, type: 'attractions' },
  { label: 'Restaurants', color: Colors.light.secondary, type: 'restaurants' },
  { label: 'Parking', color: Colors.light.tertiary, type: 'parking' },
];

export const Legend: React.FC<LegendProps> = ({ showLegend, onToggle }) => {
  if (!showLegend) {
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        <Ionicons name="map-outline" size={24} color={Colors.light.tint} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        <Ionicons name="close-circle" size={24} color={Colors.light.text} />
      </TouchableOpacity>
      <Text style={styles.title}>Legend</Text>
      {LEGEND_ITEMS.map((item) => (
        <View key={item.type} style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default Legend;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 14,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FilterType } from '@/types';
import { Colors } from '@/constants/Colors';

interface FilterButtonsProps {
  activeFilters: FilterType[];
  onFilterChange: (filter: FilterType) => void;
  availableCounts?: Record<FilterType, number>;
}

const FILTERS: { label: string; type: FilterType }[] = [
  { label: 'Attractions', type: 'attractions' },
  { label: 'Restaurants', type: 'restaurants' },
  { label: 'Parking', type: 'parking' },
];

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilters,
  onFilterChange,
  availableCounts,
}) => {
  return (
    <View style={styles.container}>
      {FILTERS.map(({ label, type }) => {
        const isActive = activeFilters.includes(type);
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              isActive ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => onFilterChange(type)}
          >
            <Text style={isActive ? styles.activeText : styles.inactiveText}>
              {label}
              {availableCounts && ` (${availableCounts[type] || 0})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FilterButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  activeButton: {
    backgroundColor: Colors.light.tint,
  },
  inactiveButton: {
    backgroundColor: Colors.light.background,
  },
  activeText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: Colors.light.tint,
  },
}); 
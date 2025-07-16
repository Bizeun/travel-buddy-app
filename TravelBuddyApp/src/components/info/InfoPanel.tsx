import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { TravelMode } from '@/types';
import { Colors } from '@/constants/Colors';

interface InfoPanelProps {
  travelMode: TravelMode;
  totalLocations: number;
  favoritesCount: number;
  currentRadius: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  travelMode,
  totalLocations,
  favoritesCount,
  currentRadius,
}) => {

  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View style={[styles.container, {bottom: tabBarHeight}]}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Mode</Text>
        <Text style={styles.statValue}>{travelMode.charAt(0).toUpperCase() + travelMode.slice(1)}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Radius</Text>
        <Text style={styles.statValue}>{currentRadius} km</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Places</Text>
        <Text style={styles.statValue}>{totalLocations}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Favorites</Text>
        <Text style={styles.statValue}>{favoritesCount}</Text>
      </View>
    </View>
  );
};

export default InfoPanel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
}); 
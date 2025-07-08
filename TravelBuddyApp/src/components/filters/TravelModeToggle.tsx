import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TravelMode } from '@/types';
import { Colors } from '@/constants/Colors';

interface TravelModeToggleProps {
  currentMode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  disabled?: boolean;
}

export const TravelModeToggle: React.FC<TravelModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          currentMode === 'car' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onModeChange('car')}
        disabled={disabled}
        accessibilityLabel="Set travel mode to car"
      >
        <Ionicons
          name="car"
          size={24}
          color={currentMode === 'car' ? Colors.light.background : Colors.light.text}
        />
        <Text
          style={[
            styles.buttonText,
            currentMode === 'car' ? styles.activeText : styles.inactiveText,
          ]}
        >
          Car (30km)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          currentMode === 'walking' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onModeChange('walking')}
        disabled={disabled}
        accessibilityLabel="Set travel mode to walking"
      >
        <Ionicons
          name="walk"
          size={24}
          color={currentMode === 'walking' ? Colors.light.background : Colors.light.text}
        />
        <Text
          style={[
            styles.buttonText,
            currentMode === 'walking' ? styles.activeText : styles.inactiveText,
          ]}
        >
          Walk (3km)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TravelModeToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: Colors.light.tabIconDefault,
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeButton: {
    backgroundColor: Colors.light.tint,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.light.background,
  },
  inactiveText: {
    color: Colors.light.text,
  },
}); 
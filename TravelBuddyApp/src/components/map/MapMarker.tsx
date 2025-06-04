import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  coordinate: { latitude: number; longitude: number };
  title: string;
  type: "attraction" | "restaurant" | "parking";
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  children: React.ReactNode; // Callout 내용
  markerColor?: string;
  icon?: string;
}

export const MapMarker: React.FC<Props> = ({
  coordinate,
  title,
  type,
  isFavorite,
  onToggleFavorite,
  children,
  markerColor = "blue",
  icon,
}) => {
  const getIcon = () => {
    switch (type) {
      case "attraction":
        return "compass";
      case "restaurant":
        return "restaurant";
      case "parking":
        return "car";
      default:
        return "location";
    }
  };

  return (
    <Marker coordinate={coordinate} title={title}>
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { backgroundColor: markerColor }]}>
          <Ionicons name={getIcon()} size={16} color="white" />
        </View>
        {isFavorite && (
          <View style={styles.favoriteIndicator}>
            <Ionicons name="heart" size={12} color="#FF3B30" />
          </View>
        )}
      </View>
      <Callout>{children}</Callout>
    </Marker>
  );
};

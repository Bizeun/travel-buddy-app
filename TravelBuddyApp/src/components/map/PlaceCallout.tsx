import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  distance: string;
  description: string;
  category?: string;
  rating?: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  additionalInfo?: React.ReactNode;
}

export const PlaceCallout: React.FC<Props> = ({
  title,
  distance,
  description,
  category,
  rating,
  isFavorite,
  onToggleFavorite,
  additionalInfo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#FF3B30" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.distance}>📍 {distance}</Text>

      {category && rating && (
        <Text style={styles.category}>
          {category} · ⭐ {rating}
        </Text>
      )}

      <Text style={styles.description}>{description}</Text>

      {additionalInfo}
    </View>
  );
};

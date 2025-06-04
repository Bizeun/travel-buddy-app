import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  travelMode: "car" | "walking";
  showFavoritesOnly: boolean;
  favoritesCount: number;
  onToggleTravelMode: () => void;
  onToggleFavorites: () => void;
}

export const TravelModeToggle: React.FC<Props> = ({
  travelMode,
  showFavoritesOnly,
  favoritesCount,
  onToggleTravelMode,
  onToggleFavorites,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, travelMode === "car" ? styles.active : null]}
        onPress={onToggleTravelMode}
      >
        <Ionicons
          name="car"
          size={20}
          color={travelMode === "car" ? "#fff" : "#333"}
        />
        <Text style={travelMode === "car" ? styles.activeText : styles.text}>
          차량
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, travelMode === "walking" ? styles.active : null]}
        onPress={onToggleTravelMode}
      >
        <Ionicons
          name="walk"
          size={20}
          color={travelMode === "walking" ? "#fff" : "#333"}
        />
        <Text
          style={travelMode === "walking" ? styles.activeText : styles.text}
        >
          도보
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, showFavoritesOnly ? styles.active : null]}
        onPress={onToggleFavorites}
      >
        <Ionicons
          name="heart"
          size={20}
          color={showFavoritesOnly ? "#fff" : "#333"}
        />
        <Text style={showFavoritesOnly ? styles.activeText : styles.text}>
          즐겨찾기 ({favoritesCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  active: {
    backgroundColor: "#4285F4",
  },
  text: {
    marginLeft: 6,
    color: "#333",
  },
  activeText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "bold",
  },
});

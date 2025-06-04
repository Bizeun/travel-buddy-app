import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  showType: "attractions" | "restaurants" | "both";
  showParking: boolean;
  travelMode: "car" | "walking";
  attractionsCount: number;
  restaurantsCount: number;
  parkingCount: number;
  onChangeShowType: (type: "attractions" | "restaurants" | "both") => void;
  onToggleParking: () => void;
}

export const FilterButtons: React.FC<Props> = ({
  showType,
  showParking,
  travelMode,
  attractionsCount,
  restaurantsCount,
  parkingCount,
  onChangeShowType,
  onToggleParking,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          showType === "attractions" || showType === "both"
            ? styles.active
            : null,
        ]}
        onPress={() =>
          onChangeShowType(showType === "restaurants" ? "both" : "attractions")
        }
      >
        <Ionicons
          name="compass"
          size={18}
          color={
            showType === "attractions" || showType === "both"
              ? "#4285F4"
              : "#888"
          }
        />
        <Text style={styles.text}>관광지 ({attractionsCount})</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          showType === "restaurants" || showType === "both"
            ? styles.active
            : null,
        ]}
        onPress={() =>
          onChangeShowType(showType === "attractions" ? "both" : "restaurants")
        }
      >
        <Ionicons
          name="restaurant"
          size={18}
          color={
            showType === "restaurants" || showType === "both"
              ? "#4285F4"
              : "#888"
          }
        />
        <Text style={styles.text}>음식점 ({restaurantsCount})</Text>
      </TouchableOpacity>

      {travelMode === "car" && (
        <TouchableOpacity
          style={[styles.button, showParking ? styles.active : null]}
          onPress={onToggleParking}
        >
          <MaterialCommunityIcons
            name="parking"
            size={18}
            color={showParking ? "#4285F4" : "#888"}
          />
          <Text style={styles.text}>주차장 ({parkingCount})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

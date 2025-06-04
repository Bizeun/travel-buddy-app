import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  travelMode: "car" | "walking";
  restaurantsCount: number;
  attractionsCount: number;
  parkingCount?: number;
  favoritesCount?: number;
  showFavoritesOnly?: boolean;
}

export const InfoPanel: React.FC<Props> = ({
  travelMode,
  restaurantsCount,
  attractionsCount,
  parkingCount = 0,
  favoritesCount = 0,
  showFavoritesOnly = false,
}) => {
  return (
    <View>
      {/* 즐겨찾기 통계 */}
      {favoritesCount > 0 && (
        <View style={styles.favoritesContainer}>
          <Text style={styles.favoritesText}>
            💝 Stored Total {favoritesCount} favorites.
            {showFavoritesOnly &&
              ` (현재 ${attractionsCount + restaurantsCount}개 표시 중)`}
          </Text>
        </View>
      )}

      {/* 메인 정보 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {travelMode === "car"
            ? `차량 모드: 최대 30km 반경 | 음식점 ${restaurantsCount}개, 관광지 ${attractionsCount}개${
                parkingCount > 0 ? `, 주차장 ${parkingCount}개` : ""
              }`
            : `도보 모드: 최대 3km 반경 | 음식점 ${restaurantsCount}개, 관광지 ${attractionsCount}개`}
        </Text>
      </View>
    </View>
  );
};

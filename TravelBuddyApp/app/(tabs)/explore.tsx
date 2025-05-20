import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
} from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<"car" | "walking">("car");
  const [region, setRegion] = useState({
    latitude: 39.8283, // instant value and place
    longitude: -98.5795,
    latitudeDelta: 30,
    longitudeDelta: 30,
  });

  const [showType, setShowType] = useState<
    "attractions" | "restaurants" | "both"
  >("both");

  const travelRadius = {
    car: 30000,
    walking: 3000,
  };

  const attractions = [
    {
      id: 1,
      name: "NewYork",
      coord: { latitude: 40.6892, longitude: -74.0445 },
      description: "미국의 상징, 자유의 여신상",
    },
    {
      id: 2,
      name: "Grand Cayon",
      coord: { latitude: 36.0544, longitude: -112.2401 },
      description: "콜로라도 강이 만든 장대한 협곡",
    },
    {
      id: 3,
      name: "Golden State",
      coord: { latitude: 37.8199, longitude: -122.4783 },
      description: "샌프란시스코의 상징",
    },
    {
      id: 4,
      name: "Las Vagas",
      coord: { latitude: 36.1147, longitude: -115.1728 },
      description: "화려한 카지노와 호텔이 즐비한 거리",
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "The French Laundry",
      coord: { latitude: 38.4045, longitude: -122.3644 },
      category: "Fine Dining",
      rating: 4.8,
      description: "세계적으로 유명한 파인 다이닝 레스토랑",
    },
    {
      id: 2,
      name: "In-N-Out Burger",
      coord: { latitude: 37.8044, longitude: -122.4197 },
      category: "Fast Food",
      rating: 4.5,
      description: "캘리포니아의 유명한 햄버거 체인",
    },
    {
      id: 3,
      name: "Katz's Delicatessen",
      coord: { latitude: 40.7223, longitude: -73.9874 },
      category: "Deli",
      rating: 4.6,
      description: "뉴욕의 유명한 델리, 파스트라미 샌드위치가 유명",
    },
    {
      id: 4,
      name: "Franklin Barbecue",
      coord: { latitude: 30.2701, longitude: -97.7313 },
      category: "BBQ",
      rating: 4.7,
      description: "텍사스 오스틴의 유명한 바베큐 레스토랑",
    },
    {
      id: 5,
      name: "Pizzeria Bianco",
      coord: { latitude: 33.4484, longitude: -112.074 },
      category: "Italian",
      rating: 4.6,
      description: "애리조나 피닉스의 최고 피자집",
    },
  ];

  const toggleTravelMode = () => {
    setTravelMode(travelMode === "car" ? "walking" : "car");
  };

  const changeShowType = (type: "attractions" | "restaurants" | "both") => {
    setShowType(type);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Access Denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: travelMode === "car" ? 0.5 : 0.05,
          longitudeDelta: travelMode === "car" ? 0.5 : 0.05,
        });
      }
    })();
  }, [travelMode]);

  const getMarkerColor = (category: string) => {
    switch (category) {
      case "Fine Dining":
        return "purple";
      case "Fast Food":
        return "red";
      case "Deli":
        return "orange";
      case "BBQ":
        return "brown";
      case "Italian":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Explore around</Text>
        <Text style={styles.subtitle}>
          {travelMode === "car" ? "Driving Travel mode" : "Walking Travel mode"}
        </Text>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>

      <View style={styles.modeButtonContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            travelMode === "car" ? styles.activeMode : null,
          ]}
          onPress={toggleTravelMode}
        >
          <Ionicons
            name="car"
            size={20}
            color={travelMode === "car" ? "#fff" : "#333"}
          />
          <Text
            style={
              travelMode === "car" ? styles.activeModeText : styles.modeText
            }
          >
            CAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            travelMode === "walking" ? styles.activeMode : null,
          ]}
          onPress={toggleTravelMode}
        >
          <Ionicons
            name="walk"
            size={20}
            color={travelMode === "walking" ? "#fff" : "#333"}
          />
          <Text
            style={
              travelMode === "walking" ? styles.activeModeText : styles.modeText
            }
          >
            WALK
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.showTypeContainer}>
        <TouchableOpacity
          style={[
            styles.showTypeButton,
            showType === "attractions" || showType === "both"
              ? styles.activeShowType
              : null,
          ]}
          onPress={() =>
            changeShowType(showType === "restaurants" ? "both" : "attractions")
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
          <Text style={styles.showTypeText}>관광지</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.showTypeButton,
            showType === "restaurants" || showType === "both"
              ? styles.activeShowType
              : null,
          ]}
          onPress={() =>
            changeShowType(showType === "attractions" ? "both" : "restaurants")
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
          <Text style={styles.showTypeText}>RESTAURANT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {location && (
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={travelRadius[travelMode]}
              strokeWidth={1}
              strokeColor={"rgba(66, 133, 244, 0.8)"}
              fillColor={"rgba(66, 133, 244, 0.2)"}
            />
          )}

          {(showType === "attractions" || showType === "both") &&
            attractions.map((attraction) => (
              <Marker
                key={`attraction-${attraction.id}`}
                coordinate={attraction.coord}
                title={attraction.name}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{attraction.name}</Text>
                    <Text style={styles.calloutDescription}>
                      {attraction.description}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}

          {(showType === "restaurants" || showType === "both") &&
            restaurants.map((restaurant) => (
              <Marker
                key={`restaurant-${restaurant.id}`}
                coordinate={restaurant.coord}
                title={restaurant.name}
                pinColor={getMarkerColor(restaurant.category)}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                    <Text style={styles.calloutCategory}>
                      {restaurant.category} · ⭐ {restaurant.rating}
                    </Text>
                    <Text style={styles.calloutDescription}>
                      {restaurant.description}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
        </MapView>
      </View>

      {(showType === "restaurants" || showType === "both") && (
        <View style={styles.legendContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "purple" }]}
              />
              <Text style={styles.legendText}>Fine Dining</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "red" }]} />
              <Text style={styles.legendText}>Fast Food</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "orange" }]}
              />
              <Text style={styles.legendText}>Deli</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "brown" }]}
              />
              <Text style={styles.legendText}>BBQ</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "green" }]}
              />
              <Text style={styles.legendText}>Italian</Text>
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {travelMode === "car"
            ? "Driving Travel mode: Recommend Attractions within 30km"
            : "Walking Travel mode: Recommend Attractions within 3km"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2a2a2a",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#4a4a4a",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  modeButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeMode: {
    backgroundColor: "#4285F4",
  },
  modeText: {
    marginLeft: 6,
    color: "#333",
  },
  activeModeText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "bold",
  },
  showTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4e8",
  },
  showTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeShowType: {
    borderBottomWidth: 2,
    borderBottomColor: "#4285F4",
  },
  showTypeText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  calloutCategory: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#e1e4e8",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#555",
  },
  infoContainer: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e1e4e8",
  },
  infoText: {
    textAlign: "center",
    color: "#444",
    fontSize: 14,
  },
});

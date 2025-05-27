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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const formatDistance = (
    distanceKm: number,
    mode: "car" | "walking"
  ): string => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else {
      const formatted = distanceKm.toFixed(1);
      if (mode === "walking") {
        const walkingTime = Math.round(distanceKm * 12);
        return `${formatted}km (도보 ${walkingTime}분)`;
      } else {
        const drivingTime = Math.round(distanceKm * 2);
        return `${formatted}km (차량 ${drivingTime}분)`;
      }
    }
  };

  const [showType, setShowType] = useState<
    "attractions" | "restaurants" | "both"
  >("both");

  const [showParking, setShowParking] = useState(true);

  const travelRadius = {
    car: 30000,
    walking: 3000,
  };

  const getPlacesWithDistance = (
    places: any[],
    userLocation: Location.LocationObject | null
  ) => {
    if (!userLocation) return places;

    return places
      .map((place) => {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          place.coord.latitude,
          place.coord.longitude
        );
        return {
          ...place,
          distance,
          formattedDistance: formatDistance(distance, travelMode),
        };
      })
      .sort((a, b) => a.distance - b.distance);
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

  const parkingLots = [
    {
      id: 1,
      name: "Union Square Garage",
      coord: { latitude: 37.7879, longitude: -122.4075 },
      capacity: 500,
      hourlyRate: 8,
      type: "Garage",
      availability: "Available",
      walkingRadius: 0.3, // km
    },
    {
      id: 2,
      name: "Times Square Parking",
      coord: { latitude: 40.758, longitude: -73.9855 },
      capacity: 200,
      hourlyRate: 12,
      type: "Garage",
      availability: "Full",
      walkingRadius: 0.2,
    },
    {
      id: 3,
      name: "Lincoln Park Zoo Lot",
      coord: { latitude: 41.9217, longitude: -87.6345 },
      capacity: 150,
      hourlyRate: 5,
      type: "Surface",
      availability: "Available",
      walkingRadius: 0.4,
    },
    {
      id: 4,
      name: "Hollywood & Highland",
      coord: { latitude: 34.1022, longitude: -118.3387 },
      capacity: 800,
      hourlyRate: 10,
      type: "Garage",
      availability: "Available",
      walkingRadius: 0.5,
    },
    {
      id: 5,
      name: "National Mall Parking",
      coord: { latitude: 38.8899, longitude: -77.0091 },
      capacity: 300,
      hourlyRate: 6,
      type: "Surface",
      availability: "Limited",
      walkingRadius: 0.6,
    },
  ];

  const getPlacesInRadius = (places: any[]) => {
    const radiusKm = travelRadius[travelMode] / 1000;
    return places.filter((place) => place.distance <= radiusKm);
  };

  const nearbyAttractions = getPlacesInRadius(attractions);
  const nearbyRestaurants = getPlacesInRadius(restaurants);

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

  const findNearbyPlaces = (parkingLot: any, places: any[]) => {
    return places.filter((place) => {
      const distance = calculateDistance(
        parkingLot.coord.latitude,
        parkingLot.coord.longitude,
        place.coord.latitude,
        place.coord.longitude
      );
      return distance <= parkingLot.walkingRadius;
    });
  };

  const getParkingColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "#34C759";
      case "Limited":
        return "#FF9500";
      case "Full":
        return "#FF3B30";
      default:
        return "#007AFF";
    }
  };
  const getParkingIcon = (type: string) => {
    return type === "Garage" ? "parking" : "car";
  };
  const nearbyParkingLots = location
    ? parkingLots
        .filter((parking) => {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            parking.coord.latitude,
            parking.coord.longitude
          );
          return distance <= travelRadius[travelMode] / 1000;
        })
        .map((parking) => {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            parking.coord.latitude,
            parking.coord.longitude
          );
          return {
            ...parking,
            distance,
            formattedDistance: formatDistance(distance, "car"),
            nearbyAttractions: findNearbyPlaces(parking, nearbyAttractions),
            nearbyRestaurants: findNearbyPlaces(parking, nearbyRestaurants),
          };
        })
        .sort((a, b) => a.distance - b.distance)
    : [];

  const toggleParkingDisplay = () => {
    setShowParking(!showParking);
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
          <Text style={styles.showTypeText}>
            Attractions({nearbyAttractions.length})
          </Text>
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
          <Text style={styles.showTypeText}>
            RESTAURANT({nearbyRestaurants.length})
          </Text>
        </TouchableOpacity>
        {travelMode === "car" && (
          <TouchableOpacity
            style={[
              styles.showTypeButton,
              showParking ? styles.activeShowType : null,
            ]}
            onPress={toggleParkingDisplay}
          >
            <MaterialCommunityIcons
              name="parking"
              size={18}
              color={showParking ? "#4285F4" : "#888"}
            />
            <Text style={styles.showTypeText}>
              주차장 ({nearbyParkingLots.length})
            </Text>
          </TouchableOpacity>
        )}
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

          {travelMode === "car" &&
            showParking &&
            nearbyParkingLots.map((parking) => (
              <React.Fragment key={`parking-${parking.id}`}>
                <Marker coordinate={parking.coord} title={parking.name}>
                  <View
                    style={[
                      styles.parkingMarker,
                      {
                        backgroundColor: getParkingColor(parking.availability),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getParkingIcon(parking.type)}
                      size={20}
                      color="white"
                    />
                  </View>
                  <Callout>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{parking.name}</Text>
                      <Text style={styles.calloutDistance}>
                        📍 {parking.formattedDistance}
                      </Text>
                      <View style={styles.parkingInfo}>
                        <Text style={styles.parkingDetail}>
                          💰 ${parking.hourlyRate}/시간
                        </Text>
                        <Text style={styles.parkingDetail}>
                          🚗 {parking.capacity}대
                        </Text>
                        <Text
                          style={[
                            styles.parkingStatus,
                            { color: getParkingColor(parking.availability) },
                          ]}
                        >
                          {parking.availability}
                        </Text>
                      </View>
                      {(parking.nearbyAttractions.length > 0 ||
                        parking.nearbyRestaurants.length > 0) && (
                        <View style={styles.nearbyInfo}>
                          <Text style={styles.nearbyTitle}>도보 거리 내:</Text>
                          {parking.nearbyAttractions.length > 0 && (
                            <Text style={styles.nearbyText}>
                              🏛️ 관광지 {parking.nearbyAttractions.length}개
                            </Text>
                          )}
                          {parking.nearbyRestaurants.length > 0 && (
                            <Text style={styles.nearbyText}>
                              🍽️ 음식점 {parking.nearbyRestaurants.length}개
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </Callout>
                </Marker>

                <Circle
                  center={parking.coord}
                  radius={parking.walkingRadius * 1000}
                  strokeWidth={1}
                  strokeColor={"rgba(52, 199, 89, 0.5)"}
                  fillColor={"rgba(52, 199, 89, 0.1)"}
                />
              </React.Fragment>
            ))}

          {(showType === "attractions" || showType === "both") &&
            nearbyAttractions.map((attraction) => (
              <Marker
                key={`attraction-${attraction.id}`}
                coordinate={attraction.coord}
                title={attraction.name}
                pinColor="blue"
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{attraction.name}</Text>
                    <Text style={styles.calloutDistance}>
                      📍 {attraction.formattedDistance}
                    </Text>
                    <Text style={styles.calloutDescription}>
                      {attraction.description}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}

          {(showType === "restaurants" || showType === "both") &&
            nearbyRestaurants.map((restaurant) => (
              <Marker
                key={`restaurant-${restaurant.id}`}
                coordinate={restaurant.coord}
                title={restaurant.name}
                pinColor={getMarkerColor(restaurant.category)}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                    <Text style={styles.calloutDistance}>
                      📍 {restaurant.formattedDistance}
                    </Text>
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

      {travelMode === "car" && showParking && nearbyParkingLots.length > 0 && (
        <View style={styles.legendContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#34C759" }]}
              />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF9500" }]}
              />
              <Text style={styles.legendText}>Limited</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF3B30" }]}
              />
              <Text style={styles.legendText}>Full</Text>
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

  calloutDistance: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "bold",
    marginBottom: 5,
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
  parkingMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  parkingInfo: {
    marginTop: 5,
    marginBottom: 5,
  },
  parkingDetail: {
    fontSize: 13,
    marginBottom: 2,
  },
  parkingStatus: {
    fontSize: 13,
    fontWeight: "bold",
  },
  nearbyInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nearbyTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 3,
  },
  nearbyText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 1,
  },
  parkingTip: {
    fontSize: 12,
    color: "#34C759",
    fontStyle: "italic",
    marginTop: 5,
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
});

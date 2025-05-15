import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 39.8283, // instant value and place
    longitude: -98.5795,
    latitudeDelta: 30,
    longitudeDelta: 30,
  });

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
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Explore around</Text>
        <Text style={styles.subtitle}>Fine restourant and atrractions</Text>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {attractions.map((attraction) => (
            <Marker
              key={attraction.id}
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
        </MapView>
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
  calloutDescription: {
    fontSize: 14,
  },
});

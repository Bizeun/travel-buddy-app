import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function ExploreScreen() {
  const initialRegion = {
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 30,
    longitudeDelta: 30,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore around</Text>
        <Text style={styles.subtitle}>Fine restourant and atrractions</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  mapContainer: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});

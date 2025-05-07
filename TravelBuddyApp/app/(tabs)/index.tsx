import React from "react";
import { Platform, StyleSheet, Text, View, SafeAreaView } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Travel Buddy</Text>
        <Text style={styles.subtitle}>US travel recommendation app</Text>
        <Text style={styles.description}>
          travel recommendations for car and pedestrian travelers
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#6a6a6a",
  },
  comingSoon: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 20,
  },
});

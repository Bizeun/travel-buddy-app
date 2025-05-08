import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore around</Text>
        <Text style={styles.subtitle}>Fine restourant and atrractions</Text>
        <Text style={styles.comingSoon}>Update of map function</Text>
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
  comingSoon: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 20,
    color: "#888",
  },
});

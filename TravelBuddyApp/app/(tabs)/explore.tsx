import React, { useState, useMemo } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Circle } from "react-native-maps";

import { useLocation } from "@/hooks/useLocation";
import { useFavorites } from "@/hooks/useFavorites";
import { Place, FilterType, Restaurant } from "@/types";

import { attractions, restaurants } from "@/constants/data";
import { Colors } from "@/constants/Colors";

import TravelModeToggle from "@/components/filters/TravelModeToggle";
import FilterButtons from "@/components/filters/FilterButtons";
import MapMarker from "@/components/map/MapMarker";
import InfoPanel from "@/components/info/InfoPanel";
import Legend from "@/components/info/Legend";
import CustomCallout from "@/components/map/CustomCallout";

// Main screen for the application
export default function ExploreScreen() {
  const [travelMode, setTravelMode] = useState<"car" | "walking">("car");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['attractions', 'restaurants']);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const { location, region } = useLocation(travelMode);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };
  
  const allPlaces = useMemo((): Place[] => {
    const combined: Place[] = [...attractions, ...restaurants];
    return combined.map((place) => ({
      ...place,
      isFavorite: isFavorite(String(place.id)),
    }));
  }, [isFavorite]);

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter(place => {
      if ('category' in place) {
        return activeFilters.includes('restaurants');
      }
      return activeFilters.includes('attractions');
    });
  }, [allPlaces, activeFilters]);

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
  };

  const isRestaurant = (place: Place): place is Restaurant => {
    return 'category' in place;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
        {location && (
          <Circle
            center={location.coords}
            radius={travelMode === "car" ? 30000 : 3000}
            strokeColor={Colors.light.tint}
            fillColor="rgba(0, 122, 255, 0.1)"
          />
        )}
        {filteredPlaces.map((place) => (
          <MapMarker
            key={`${place.id}-${place.name}`}
            place={place}
            onPress={() => handleMarkerPress(place)}
            onFavoriteToggle={() => toggleFavorite({ id: String(place.id), name: place.name, type: isRestaurant(place) ? 'restaurants' : 'attractions'})}
            isFavorite={isFavorite(String(place.id))}
          />
        ))}
      </MapView>

      <View style={styles.overlayContainer}>
        <TravelModeToggle
          currentMode={travelMode}
          onModeChange={setTravelMode}
        />
        <FilterButtons
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </View>
      
      {selectedPlace ? (
         <CustomCallout
          title={selectedPlace.name}
          distance={selectedPlace.distance}
          isFavorite={isFavorite(String(selectedPlace.id))}
          onFavoriteToggle={() => toggleFavorite({ id: String(selectedPlace.id), name: selectedPlace.name, type: isRestaurant(selectedPlace) ? 'restaurants' : 'attractions'})}
          description={selectedPlace.description}
        />
      ) : (
        <InfoPanel
          travelMode={travelMode}
          totalLocations={filteredPlaces.length}
          favoritesCount={favorites.length}
          currentRadius={travelMode === 'car' ? 30 : 3}
        />
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlayContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
  },
});

import React, { useState, useMemo, useEffect, useRef } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions, LayoutAnimation, Button, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Circle, Point } from "react-native-maps";
import Constants from 'expo-constants';

import { useLocation } from "@/hooks/useLocation";
import { useFavorites } from "@/hooks/useFavorites";
import { Place, FilterType, Restaurant, Attraction } from "@/types";

// import { attractions, restaurants } from "@/constants/data";
import { Colors } from "@/constants/Colors";

import TravelModeToggle from "@/components/filters/TravelModeToggle";
import FilterButtons from "@/components/filters/FilterButtons";
import MapMarker from "@/components/map/MapMarker";
import InfoPanel from "@/components/info/InfoPanel";
import CustomCallout from "@/components/map/CustomCallout";
import { getCache, setCache } from "@/utils/cache";

// Main screen for the application
export default function ExploreScreen() {
  const [travelMode, setTravelMode] = useState<"car" | "walking">("car");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['attractions', 'restaurants']);

  const { location, region } = useLocation(travelMode);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeDetails, setPlaceDetails] = useState<Partial<Place> | null>(null);
  const [calloutPosition, setCalloutPosition] = useState<Point | null>(null);
  const [nextPageTokens, setNextPageTokens] = useState<Record<FilterType, string | undefined>>({
    attractions: undefined,
    restaurants: undefined,
    parking: undefined,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const mapRef = useRef<MapView>(null);

  const fetchPlacesForType = async (type: FilterType, pageToken?: string): Promise<{places: Place[], nextToken?: string}> => {
    if (!location) return { places: [], nextToken: undefined };

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    const apiKey = Constants.expoConfig?.extra?.googleApiKey;
    
    const cacheKey = `${type}_${lat.toFixed(3)}_${lng.toFixed(3)}_${pageToken || ''}`;
    const cachedData = await getCache<{places: Place[], nextToken?: string}>(cacheKey);
    if (cachedData) {
      console.log('Cache hit for', cacheKey);
      return cachedData;
    }
    console.log('Cache miss for', cacheKey);

    if (!apiKey) {
      console.error("API key is missing");
      return { places: [], nextToken: undefined };
    }

    let googleType: string;
    switch(type) {
      case 'attractions':
        googleType = 'tourist_attraction';
        break;
      case 'restaurants':
        googleType = 'restaurant';
        break;
      case 'parking':
          googleType = 'parking';
          break;
      default:
        return { places: [], nextToken: undefined };
    }

    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${googleType}&key=${apiKey}`;
    if (pageToken) {
      url += `&pagetoken=${pageToken}`;
    }
    
    try {
      // Google Places API requires a short delay between pagetoken requests
      if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const result = {
            places: data.results.map((p: any): Place => {
                const basePlace = {
                    id: p.place_id,
                    name: p.name,
                    coord: {
                        latitude: p.geometry.location.lat,
                        longitude: p.geometry.location.lng,
                    },
                    description: p.vicinity || 'No description available',
                    types: p.types || [],
                };
    
                if (p.types?.includes('restaurant')) {
                    return {
                        ...basePlace,
                        category: p.types?.[0] || 'Restaurant',
                        rating: p.rating || 0,
                    } as Restaurant;
                }
                return basePlace as Attraction;
            }) as Place[],
            nextToken: data.next_page_token
        };
        await setCache(cacheKey, result);
        return result;
      } else {
        console.error(`Error fetching ${type}:`, data.status, data.error_message);
        return { places: [], nextToken: undefined };
      }
    } catch (error) {
      console.error(`Error during fetch for ${type}:`, error);
      return { places: [], nextToken: undefined };
    }
  };

  useEffect(() => {
    const fetchAllPlaces = async () => {
        setNearbyPlaces([]); // Clear previous results
        setNextPageTokens({ attractions: undefined, restaurants: undefined, parking: undefined });

        const promises = activeFilters.map(filter => fetchPlacesForType(filter));
        const results = await Promise.all(promises);
        
        const allPlaces = results.map(r => r.places).flat();

        const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.id, p])).values());
        
        const placesWithFavorites = uniquePlaces.map(place => ({
            ...place,
            isFavorite: isFavorite(place.id) || false,
        }));

        setNearbyPlaces(placesWithFavorites);

        const newTokens: Record<FilterType, string | undefined> = { attractions: undefined, restaurants: undefined, parking: undefined };
        activeFilters.forEach((filter, index) => {
            newTokens[filter] = results[index].nextToken;
        });
        setNextPageTokens(newTokens);
    };
    
    if (location) {
        fetchAllPlaces();
    }

  }, [location, activeFilters, isFavorite]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !location) return;
    setIsLoadingMore(true);

    const morePlacesPromises = activeFilters
        .filter(filter => nextPageTokens[filter])
        .map(filter => fetchPlacesForType(filter, nextPageTokens[filter]));
    
    const results = await Promise.all(morePlacesPromises);

    const newPlaces = results.map(r => r.places).flat();
    const uniqueNewPlaces = newPlaces.filter(p => !nearbyPlaces.some(existing => existing.id === p.id));

    const placesWithFavorites = uniqueNewPlaces.map(place => ({
        ...place,
        isFavorite: isFavorite(place.id) || false,
    }));

    setNearbyPlaces(prev => [...prev, ...placesWithFavorites]);

    const newTokens: Record<FilterType, string | undefined> = { ...nextPageTokens };
    let filterIndex = 0;
    activeFilters.forEach(filter => {
        if(nextPageTokens[filter]) {
            newTokens[filter] = results[filterIndex]?.nextToken;
            filterIndex++;
        }
    });

    setNextPageTokens(newTokens);
    setIsLoadingMore(false);
  };


  useEffect(() => {
    if (!selectedPlace) {
      setPlaceDetails(null); 
      return;
    }

    const fetchPlaceDetails = async () => {
      const apiKey = Constants.expoConfig?.extra?.googleApiKey;
      if (!apiKey) {
        console.error("API key is missing");
        return;
      }
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedPlace.id}&fields=name,rating,formatted_address,opening_hours&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.result) {
          setPlaceDetails(data.result);
          
        } else {
          console.error("Error fetching place details:", data.status, data.error_message);
        }
      } catch (error) {
        console.error("Error during fetch for place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [selectedPlace]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const isRestaurant = (place: Place): place is Restaurant => {
    return 'category' in place;
    }


  const handleMarkerPress = async (place: Place) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedPlace(place);

    if (mapRef.current) {
      const point = await mapRef.current.pointForCoordinate(place.coord);
      setCalloutPosition(point);
    }
  };

  const handleMapPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedPlace(null);
    setCalloutPosition(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
      <MapView 
        ref={mapRef}
        provider={PROVIDER_GOOGLE} style={styles.map} region={region} onPress={handleMapPress}>
        {location && (
          <Circle
            center={location.coords}
            radius={travelMode === "car" ? 30000 : 3000}
            strokeColor={Colors.light.tint}
            fillColor="rgba(0, 122, 255, 0.1)"
          />
        )}
        {nearbyPlaces.map((place) => (
          <MapMarker
            key={place.id}
            place={place}
            onPress={() => handleMarkerPress(place)}
            isSelected={selectedPlace?.id === place.id}
          
          />
        ))}
      </MapView>
        
      {selectedPlace && calloutPosition && (
        <View style={[styles.callout, { left: calloutPosition.x - 125, top: calloutPosition.y - 150 }]}>
          <CustomCallout
            place={{ ...selectedPlace, ...placeDetails }}
            isFavorite={isFavorite(selectedPlace.id)}
            onFavoriteToggle={() => toggleFavorite({ id: selectedPlace.id, name: selectedPlace.name, type: isRestaurant(selectedPlace) ? 'restaurants' : 'attractions' })}
          />
        </View>
      )}

      <View style={styles.overlayContainer}>
        <TravelModeToggle
          currentMode={travelMode}
          onModeChange={setTravelMode}
        />
        <FilterButtons
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
        {Object.values(nextPageTokens).some(token => token) && (
            <View style={styles.loadMoreContainer}>
                {isLoadingMore ? (
                    <ActivityIndicator size="small" color={Colors.light.text} />
                ) : (
                    <Button title="Load More" onPress={handleLoadMore} color={Colors.light.tint} />
                )}
            </View>
        )}
      </View>
      {!selectedPlace && (
        <InfoPanel
        travelMode={travelMode}
        totalLocations={nearbyPlaces.length}
        favoritesCount={favorites.length}
        currentRadius={travelMode === 'car' ? 30 : 3}
      />
      )}     
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    alignItems: 'center',
  },
  callout: {
    position: 'absolute',
    zIndex: 10,
  },
  loadMoreContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  }
});

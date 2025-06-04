import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem("travel_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    try {
      await AsyncStorage.setItem(
        "travel_favorites",
        JSON.stringify(newFavorites)
      );
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  useEffect(() => {
    loadFavorites();
  }, []);

  return { favorites, toggleFavorite, isFavorite };
};

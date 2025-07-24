import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supaClient';
import { useAuth } from '@/context/AuthContext';
import { Place, FavoriteItem } from '@/types';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('place_id, name, types, address')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const favoriteItems: FavoriteItem[] = data.map((fav) => ({
          id: fav.place_id,
          name: fav.name,
          types: fav.types || [],
          address: fav.address,
        }));
        setFavorites(favoriteItems);
      }
    } catch (error) {
      console.error('Failed to load favorites from Supabase', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addToFavorites = useCallback(
    async (item: Place & { address?: string }) => {
      if (!user) return;

      const newFavorite: {
        user_id: string;
        place_id: string;
        name: string;
        types: string[];
        address?: string;
      } = {
        user_id: user.id,
        place_id: item.id,
        name: item.name,
        types: item.types || [],
        address: item.address,
      };

      try {
        const { error } = await supabase
          .from('favorites')
          .insert(newFavorite);

        if (error) throw error;

        await fetchFavorites();
      } catch (error) {
        console.error('Failed to save favorite to Supabase', error);
      }
    },
    [user, fetchFavorites]
  );

  const removeFromFavorites = useCallback(
    async (placeId: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('place_id', placeId);

        if (error) throw error;
        await fetchFavorites();
      } catch (error) {
        console.error('Failed to remove favorite from Supabase', error);
      }
    },
    [user, fetchFavorites]
  );

  const isFavorite = useCallback(
    (placeId: string): boolean => {
      return favorites.some((fav) => fav.id === placeId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: Place & { address?: string }) => {
      if (isFavorite(item.id)) {
        removeFromFavorites(item.id);
      } else {
        addToFavorites(item);
      }
    },
    [isFavorite, removeFromFavorites, addToFavorites]
  );

  const clearAllFavorites = useCallback(async () => {
    if (!user) return;
    try {
        await supabase.from('favorites').delete().eq('user_id', user.id);
        setFavorites([]);
    } catch (error) {
        console.error('Failed to clear all favorites from Supabase', error);
    }
  }, [user]);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
  };
}; 
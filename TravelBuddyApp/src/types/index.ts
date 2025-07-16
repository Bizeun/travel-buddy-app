export type TravelMode = 'car' | 'walking';
export type FilterType = 'attractions' | 'restaurants' | 'parking';

export interface Location {
  lat: number;
  lng: number;
}

export interface BasePlace {
  id: string;
  name: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  description: string;
  types?: string[];
  isFavorite?: boolean;
  formatted_address?: string; 
  rating?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

export interface Attraction extends BasePlace {}

export interface Restaurant extends BasePlace {
  category: string;
  rating: number;
}

export type Place = Attraction | Restaurant;

export type MarkerData = Place & {
  lat: number;
  lng: number;
};

export interface FavoriteItem {
  id: string;
  name: string;
  type: FilterType;
} 
export type Attraction = {
    id: string;
    name: string;
    coord: {
        latitude: number;
        longitude: number;
    };
    description: string;
    isFavorite?: boolean;
    types?: string[];
    formatted_address?: string;
    opening_hours?: {
        open_now: boolean;
    };
};

export type Restaurant = {
    id: string;
    name:string;
    coord: {
        latitude: number;
        longitude: number;
    };
    description: string;
    category: string;
    rating: number;
    isFavorite?: boolean;
    types?: string[];
    formatted_address?: string;
    opening_hours?: {
        open_now: boolean;
    };
};

export type Place = Attraction | Restaurant;

export type FilterType = 'restaurants' | 'attractions' | 'parking';

export type TravelMode = 'car' | 'walking';

export interface Location {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
}

export interface FavoriteItem {
  id: string; // Corresponds to place_id
  name: string;
  types: string[];
  address?: string; // Add optional address field
} 
export interface Place {
  id: string;
  name: string;
  coord: {
    latitude: number;
    longitude: number;
  };
  description: string;
  distance?: number;
  formattedDistance?: string;
}

export interface Restaurant extends Place {
  category: string;
  rating: number;
}

export interface Attraction extends Place {
  type: string;
}

export interface ParkingLot extends Place {
  capacity: number;
  hourlyRate: number;
  type: "Garage" | "Surface";
  availability: "Available" | "Limited" | "Full";
  walkingRadius: number;
}

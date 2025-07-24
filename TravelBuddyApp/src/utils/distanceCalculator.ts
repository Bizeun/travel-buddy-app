interface LatLng {
    latitude: number;
    longitude: number;
}

export const haversineDistance = (coords1: LatLng, coords2: LatLng): number => {
    const toRad = (x: number) => x * Math.PI / 180;

    const R = 6371e3; // Earth's radius in meters
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
};

export const isWithinRadius = (userLocation: LatLng, targetLocation: LatLng, radius: number): boolean => {
    const distance = haversineDistance(userLocation, targetLocation);
  return distance <= radius;
}; 
import { Location } from '@/types';

/**
 * Converts degrees to radians.
 * @param {number} deg - The degree value.
 * @returns {number} The value in radians.
 */
const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @param {Location} loc1 - The first location.
 * @param {Location} loc2 - The second location.
 * @returns {number} The distance in kilometers.
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Formats a distance for display, converting to meters if less than 1 km.
 * @param {number} distance - The distance in kilometers.
 * @returns {string} The formatted distance string (e.g., "5.2 km" or "500 m").
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Checks if a target location is within a specified radius from a user's location.
 * @param {Location} userLocation - The user's current location.
 * @param {Location} targetLocation - The target location to check.
 * @param {number} radius - The radius in kilometers.
 * @returns {boolean} True if the target is within the radius, false otherwise.
 */
export const isWithinRadius = (
  userLocation: Location,
  targetLocation: Location,
  radius: number
): boolean => {
  const distance = calculateDistance(userLocation, targetLocation);
  return distance <= radius;
}; 
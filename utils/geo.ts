
import type { Feature } from 'geojson';
import type { MapLayer, NearestInfo, AirbaseLocation, NearestAirbaseInfo } from '../types';
import L from 'leaflet';

/**
 * Formats a distance in meters into a readable string (e.g., '1.23 km' or '450 m').
 * @param distance - The distance in meters.
 * @returns A formatted string representation of the distance.
 */
export const formatDistance = (distance: number | null): string => {
  if (distance === null) return 'N/A';
  if (distance > 1000) {
    return `${(distance / 1000).toFixed(2)} km`;
  }
  return `${Math.round(distance)} m`;
};


/**
 * Calculates the distance between two GeoJSON Point features.
 * @param feature1 - The first feature.
 * @param feature2 - The second feature.
 * @returns The distance in meters, or null if geometries are invalid.
 */
const getDistance = (feature1: Feature, feature2: Feature): number | null => {
  if (feature1.geometry.type !== 'Point' || feature2.geometry.type !== 'Point') {
    return null;
  }
  const latlng1 = L.latLng(feature1.geometry.coordinates[1], feature1.geometry.coordinates[0]);
  const latlng2 = L.latLng(feature2.geometry.coordinates[1], feature2.geometry.coordinates[0]);
  return latlng1.distanceTo(latlng2);
};

/**
 * Finds the nearest feature from a collection of target layers to a source feature.
 * @param sourceFeature - The feature to measure from.
 * @param targetLayers - An array of MapLayer to search within.
 * @returns An object containing the nearest feature and the distance to it.
 */
export const findNearest = (sourceFeature: Feature, targetLayers: MapLayer[]): NearestInfo => {
  let nearestFeature: Feature | null = null;
  let minDistance: number | null = null;

  if (sourceFeature.geometry.type !== 'Point') {
    return { feature: null, distance: null };
  }

  targetLayers.forEach(layer => {
    if (layer.data && layer.data.features) {
      layer.data.features.forEach(targetFeature => {
        if (targetFeature.geometry.type === 'Point') {
          const distance = getDistance(sourceFeature, targetFeature);
          // Check distance > 0 to exclude the source feature itself
          if (distance !== null && distance > 0 && (minDistance === null || distance < minDistance)) {
            minDistance = distance;
            nearestFeature = targetFeature;
          }
        }
      });
    }
  });

  return { feature: nearestFeature, distance: minDistance };
};

/**
 * Finds the nearest airbase to a given GeoJSON Point feature.
 * @param sourceFeature - The feature to measure from.
 * @param airbases - An array of AirbaseLocation objects.
 * @returns An object containing the nearest airbase and the distance to it.
 */
export const findNearestAirbase = (sourceFeature: Feature, airbases: AirbaseLocation[]): NearestAirbaseInfo => {
  let nearestAirbase: AirbaseLocation | null = null;
  let minDistance: number | null = null;

  if (sourceFeature.geometry.type !== 'Point') {
    return { airbase: null, distance: null };
  }

  const sourceLatLng = L.latLng(sourceFeature.geometry.coordinates[1], sourceFeature.geometry.coordinates[0]);

  airbases.forEach(airbase => {
    const airbaseLatLng = L.latLng(airbase.coordinates[0], airbase.coordinates[1]);
    const distance = sourceLatLng.distanceTo(airbaseLatLng);

    if (minDistance === null || distance < minDistance) {
      minDistance = distance;
      nearestAirbase = airbase;
    }
  });

  return { airbase: nearestAirbase, distance: minDistance };
};

/**
 * Generates a random point within a specified radius from a center coordinate.
 * Uses a method that ensures uniform distribution over the circular area.
 * @param center - The center coordinates as [lat, lng].
 * @param radiusInMeters - The radius in meters.
 * @returns A GeoJSON Point feature.
 */
export const generateRandomPointInRadius = (center: [number, number], radiusInMeters: number): Feature => {
  const [lat, lng] = center;
  // Earth radius in meters
  const earthRadius = 6371000;
  
  const y0 = lat * (Math.PI / 180);
  const x0 = lng * (Math.PI / 180);

  const rd = radiusInMeters / earthRadius; // Angular distance

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Adjust the x-coordinate for the shrinking of the east-west distances
  const new_x = x / Math.cos(y0);
  
  const foundLat = y + y0;
  const foundLng = new_x + x0;
  
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      // Convert back to degrees
      coordinates: [foundLng * (180 / Math.PI), foundLat * (180 / Math.PI)],
    },
  };
};
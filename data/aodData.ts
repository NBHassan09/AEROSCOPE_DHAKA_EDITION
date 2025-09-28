import type { FeatureCollection, Feature, Polygon } from 'geojson';

// Helper to create a circular polygon approximation
const createCircle = (center: [number, number], radius: number, properties: any, points: number = 32): Feature<Polygon> => {
    const [lon, lat] = center;
    const coords: [number, number][] = [];
    const radiusInDegrees = radius / 111.32; // Rough conversion from km to degrees
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const pointLon = lon + (radiusInDegrees * Math.cos(angle)) / Math.cos(lat * Math.PI / 180);
        const pointLat = lat + (radiusInDegrees * Math.sin(angle));
        coords.push([pointLon, pointLat]);
    }
    coords.push(coords[0]); // Close the polygon

    return {
        type: 'Feature',
        properties,
        geometry: {
            type: 'Polygon',
            coordinates: [coords]
        }
    };
};


export const aodData: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    // Tejgaon - highest pollution due to industrial activity and central location
    createCircle([90.4090, 23.7800], 5, { name: 'Tejgaon Industrial AOD Plume', aod_intensity: 0.85 }),
    // HSIA - high pollution from airport and surrounding traffic
    createCircle([90.3973, 23.8436], 7, { name: 'HSIA Airport AOD Plume', aod_intensity: 0.70 }),
    // Mirpur - moderate pollution, more residential
    createCircle([90.3660, 23.8150], 6, { name: 'Mirpur Residential AOD Plume', aod_intensity: 0.55 }),
  ]
};
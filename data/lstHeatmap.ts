import type { AirbaseLocation, MapLayer } from '../types';
import type { Feature } from 'geojson';
import { generateRandomPointInRadius } from '../utils/geo';

// Assign arbitrary heat intensities. Tejgaon is most industrial/dense.
const heatIntensities: { [key: string]: number } = {
    'Tejgaon Air Base': 0.9,
    'Hazrat Shahjalal Int. Airport (HSIA)': 0.7,
    'Mirpur Cantonment': 0.4,
};

export const generateLSTHeatmapLayer = (airbases: AirbaseLocation[]): MapLayer => {
    const features: Feature[] = [];

    airbases.forEach(airbase => {
        const intensity = heatIntensities[airbase.name] || 0.5;
        
        // Number of points is proportional to intensity
        const numPoints = Math.floor(200 + intensity * 1800);

        for (let i = 0; i < numPoints; i++) {
            const randomPoint = generateRandomPointInRadius(airbase.coordinates, 7000); // 7km radius
            randomPoint.properties = { intensity };
            features.push(randomPoint);
        }
    });

    return {
        id: 'lst-heatmap',
        name: 'Urban Heat Island (LST)',
        isVisible: false,
        data: {
            type: 'FeatureCollection',
            features: features,
        }
    };
};
import type { FeatureCollection } from 'geojson';

export const ndviData: FeatureCollection = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": { "name": "Cantonment Parklands", "ndvi": 0.78 },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [90.370, 23.820], [90.380, 23.822], [90.385, 23.815], [90.375, 23.813], [90.370, 23.820]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "Tejgaon Green Patch", "ndvi": 0.45 },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [90.400, 23.775], [90.405, 23.776], [90.404, 23.772], [90.400, 23.775]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": { "name": "Airport Gardens", "ndvi": 0.62 },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [90.410, 23.850], [90.415, 23.851], [90.413, 23.847], [90.410, 23.850]
                ]]
            }
        },
         {
            "type": "Feature",
            "properties": { "name": "Ramna Park", "ndvi": 0.85 },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [90.395, 23.735], [90.400, 23.736], [90.399, 23.732], [90.395, 23.735]
                ]]
            }
        }
    ]
};
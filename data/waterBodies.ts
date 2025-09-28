
import type { FeatureCollection } from 'geojson';

export const dhakaWaterBodies: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Hatirjheel Lake" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [90.395, 23.760], [90.410, 23.765], [90.415, 23.755], [90.398, 23.750], [90.395, 23.760]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Gulshan Lake" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [90.410, 23.790], [90.420, 23.795], [90.422, 23.788], [90.418, 23.785], [90.410, 23.790]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Dhanmondi Lake" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [90.375, 23.745], [90.380, 23.748], [90.382, 23.744], [90.377, 23.741], [90.375, 23.745]
          ]
        ]
      }
    }
  ]
};

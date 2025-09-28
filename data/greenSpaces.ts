
import type { FeatureCollection } from 'geojson';

export const dhakaGreenSpaces: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Ramna Park" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [90.395, 23.735], [90.400, 23.736], [90.399, 23.732], [90.395, 23.735]
          ]
        ]
      }
    },
    {
        "type": "Feature",
        "properties": { "name": "Suhrawardy Udyan" },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [90.392, 23.738], [90.398, 23.742], [90.396, 23.734], [90.392, 23.738]
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": { "name": "Chandrima Uddan" },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [90.375, 23.774], [90.380, 23.776], [90.379, 23.772], [90.375, 23.774]
                ]
            ]
        }
    }
  ]
};

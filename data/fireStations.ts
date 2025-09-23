
import type { Feature, FeatureCollection, Point } from 'geojson';

const rawFireStationData = {
  "version": 0.6,
  "generator": "Overpass API 0.7.62.8 e802775f",
  "osm3s": {
    "timestamp_osm_base": "2025-09-23T01:32:34Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [
    { "type": "node", "id": 388311374, "lat": 23.6976446, "lon": 90.3457747, "tags": { "amenity": "fire_station", "name": "Keranigonj Fire Station" } },
    { "type": "node", "id": 415894873, "lat": 23.7139723, "lon": 90.4980671, "tags": { "amenity": "fire_station", "name": "Unknown" } },
    { "type": "node", "id": 513000466, "lat": 23.7065453, "lon": 90.4088572, "tags": { "amenity": "fire_station", "name": "Kotowali Fire Station" } },
    { "type": "node", "id": 1789199327, "lat": 23.7586653, "lon": 90.3735483, "tags": { "addr:city": "Mohammadpur, Dhaka", "addr:postcode": "1207", "addr:street": "মিরপুর রোড", "amenity": "fire_station", "name": "বাংলাদেশ ফায়ার সার্ভিস এন্ড সিভিল ডিফেন্স", "name:en": "Bangladesh Fire Service & Civil Defence", "opening_hours": "24/7", "operator": "Fire Service & Civil Defence Dept.", "phone": "+88029555555", "website": "https://fireservice.gov.bd/" } },
    { "type": "node", "id": 2419473509, "lat": 23.7885173, "lon": 90.4197982, "tags": { "amenity": "fire_station", "name": "Colombo Fire Station Head Office", "ref": "25" } },
    { "type": "node", "id": 3486588504, "lat": 23.8523935, "lon": 90.3987611, "tags": { "amenity": "fire_station", "name": "Fire Station HSIA" } },
    { "type": "node", "id": 4365328107, "lat": 23.8291334, "lon": 90.4030415, "tags": { "amenity": "fire_station", "name": "Fire Fighting Instruments" } },
    { "type": "node", "id": 4386346523, "lat": 23.8260087, "lon": 90.4058564, "tags": { "addr:city": "Dhaka City", "addr:postcode": "1206", "addr:street": "Zia Colony Road", "amenity": "fire_station", "name": "Kurmitola Fire Station", "operator": "Fire Service", "phone": "+88028713399" } },
    { "type": "node", "id": 4524600092, "lat": 23.7645212, "lon": 90.4006231, "tags": { "amenity": "fire_station", "name:en": "Fire Service & Civil Defence" } },
    { "type": "node", "id": 5233901522, "lat": 23.7216219, "lon": 90.3903229, "tags": { "addr:postcode": "1211", "addr:street": "অর্ফানেজ রোড", "amenity": "fire_station", "name:en": "Lalbagh Fire Station", "opening_hours": "24/7", "phone": "+880 2-8619981", "website": "http://www.amarphonebook.com/details/Dhaka/Bangladesh-Fire-Service-And-Civil-Defence/1/80838" } },
    { "type": "node", "id": 5622157049, "lat": 23.7833874, "lon": 90.4119169, "tags": { "addr:city": "dhaka", "addr:country": "BD", "addr:suburb": "korail", "amenity": "fire_station", "name": "Community Fire Response Team and Development Community" } },
    { "type": "node", "id": 6534986752, "lat": 23.7460250, "lon": 90.4307839, "tags": { "amenity": "fire_station", "name": "ফায়ার সার্ভিস ও সিভিল ডিফেন্স খিলগাঁও", "name:bn": "ফায়ার সার্ভিস ও সিভিল ডিফেন্স  খিলগাও", "name:en": "Fire Service and Civil Defence Khilgao" } },
    { "type": "node", "id": 9903237709, "lat": 23.8391773, "lon": 90.4857914, "tags": { "amenity": "fire_station", "name": "Purbachal Fire Service & Civil Defence", "website": "https://fireservice.gov.bd" } },
    { "type": "node", "id": 11801232248, "lat": 23.7221220, "lon": 90.4059184, "tags": { "amenity": "fire_station", "name": "Mosque of Bangladesh Fire Service & Civil Defence Headquarter, Kazi Alauddin Rd, Dhaka" } },
    { "type": "node", "id": 12025590730, "lat": 23.7250810, "lon": 90.3701701, "tags": { "amenity": "fire_station", "name": "Fire Service & Civil Defence Station" } },
    { "type": "node", "id": 12043386528, "lat": 23.7254232, "lon": 90.4285611, "tags": { "amenity": "fire_station", "name": "Dhaka Inland Container Depot (ICD) Fire Station" } },
    { "type": "node", "id": 12126672890, "lat": 23.9773220, "lon": 90.3770116, "tags": { "amenity": "fire_station", "name": "Fire Service And Civil Defence" } },
    { "type": "node", "id": 12468730304, "lat": 23.9221738, "lon": 90.2628666, "tags": { "amenity": "fire_station", "name": "Modern Fire Service And Civil Defence Station, Fire station" } },
    { "type": "node", "id": 12478305982, "lat": 23.8284302, "lon": 90.2590107, "tags": { "amenity": "fire_station", "name": "Fire Service And Civil Defence Station - Savar, Fire station" } },
    { "type": "way", "id": 234114776, "center": { "lat": 23.7226623, "lon": 90.4063475 }, "nodes": [ 4908532198, 2424145032, 2424145025, 2424144986, 4908532198 ], "tags": { "amenity": "fire_station", "building": "yes", "building:levels": "4", "name": "Fire Service & Civil Defence" } },
    { "type": "way", "id": 323600522, "center": { "lat": 23.7970301, "lon": 90.4243521 }, "nodes": [ 3303814711, 3303814706, 3303814708, 3303814712, 3303814711 ], "tags": { "amenity": "fire_station", "building": "yes", "name": "Fire Service and Civil Defence Station Baridhara" } },
    { "type": "way", "id": 450074515, "center": { "lat": 23.7565179, "lon": 90.3723266 }, "nodes": [ 4469980838, 4469980839, 4469980840, 4469980841, 4469980838 ], "tags": { "amenity": "fire_station", "building": "yes", "name": "Bangladesh Fire Service and Civil Defence" } },
    { "type": "way", "id": 463407071, "center": { "lat": 23.7244401, "lon": 90.3712010 }, "nodes": [ 4586738616, 4586738615, 4586738614, 4586738613, 4586738616 ], "tags": { "amenity": "fire_station", "name": "Fire Service & Civil Defence" } },
    { "type": "way", "id": 490645040, "center": { "lat": 23.8522552, "lon": 90.3985385 }, "nodes": [ 4828293830, 4828293835, 4828293825, 4828293620, 4828293830 ], "tags": { "amenity": "fire_station", "building": "yes" } },
    { "type": "way", "id": 499591431, "center": { "lat": 23.7226842, "lon": 90.4057741 }, "nodes": [ 4908532197, 4908532194, 4908532195, 4908532196, 4908532197 ], "tags": { "amenity": "fire_station", "building": "yes", "building:levels": "4", "name": "Fire Service & Civil Defence" } },
    { "type": "way", "id": 536878508, "center": { "lat": 23.6333694, "lon": 90.5141397 }, "nodes": [ 5199906565, 5199906566, 5199906567, 5199906568, 5199906565 ], "tags": { "addr:city": "Kella Road, Narayanganj", "amenity": "fire_station", "building": "yes", "name": "Hazigonj Fire Station হাজীগঞ্জ ফায়ার স্টেশন" } },
    { "type": "way", "id": 542007984, "center": { "lat": 23.8284507, "lon": 90.2591814 }, "nodes": [ 5240495850, 5618878905, 5618878904, 5618878903, 5618878902, 5240495851, 5618878913, 5618878909, 5618878910, 5618878912, 5618878911, 5618878908, 5618878907, 5618878906, 5240495850 ], "tags": { "amenity": "fire_station", "building": "yes", "name": "Fire Service & Civil Defence Station - Savar ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন - সাভার" } },
    { "type": "way", "id": 1129736047, "center": { "lat": 23.7474836, "lon": 90.3870934 }, "nodes": [ 10449269547, 10449269548, 10449269549, 10449269550, 10449269547 ], "tags": { "addr:city": "Dhaka", "addr:postcode": "1205", "addr:street": "Al Amin Road", "amenity": "fire_station", "building": "yes", "name": "Hazaribag Fire Station" } },
    { "type": "way", "id": 1214808843, "center": { "lat": 23.8392658, "lon": 90.4858940 }, "nodes": [ 11255162553, 11255162552, 11255162551, 11255162550, 11255162553 ], "tags": { "amenity": "fire_station", "building": "yes", "name": "Purbachal Fire Service & Civil Defence" } },
    { "type": "way", "id": 1301592200, "center": { "lat": 23.8342353, "lon": 90.4137162 }, "nodes": [ 12055861605, 12055861606, 12055861607, 12055861608, 12055861605 ], "tags": { "amenity": "fire_station", "name": "Rescue Fire Fighting Stationq" } },
    { "type": "way", "id": 1301592205, "center": { "lat": 23.8899469, "lon": 90.4022365 }, "nodes": [ 12055861625, 12055861626, 12055861627, 12055861628, 12055861625 ], "tags": { "amenity": "fire_station", "building": "yes", "layer": "1", "name": "Tongi Fire Service and Civil Defence Stationq" } },
    { "type": "relation", "id": 6655519, "center": { "lat": 23.8076934, "lon": 90.3675797 }, "members": [ { "type": "way", "ref": 448441274, "role": "inner" }, { "type": "way", "ref": 448442168, "role": "inner" }, { "type": "way", "ref": 367295876, "role": "outer" } ], "tags": { "addr:city": "Dhaka", "addr:place": "Mirpur 10", "addr:postcode": "1216", "addr:street": "Mirpur-10", "amenity": "fire_station", "government": "administrative", "name": "Fire Service and Civil Defence Training Complex", "operator": "Government", "operator:type": "government", "type": "multipolygon" } }
  ]
};

const parseOsmDataToGeoJSON = (osmData: any): FeatureCollection => {
  const features: Feature<Point>[] = [];

  osmData.elements.forEach((element: any) => {
    let coordinates: [number, number] | null = null;
    let name: string = element.tags?.['name:en'] || element.tags?.name || 'Unnamed Fire Station';

    if (element.type === 'node' && element.lat && element.lon) {
      coordinates = [element.lon, element.lat];
    } else if ((element.type === 'way' || element.type === 'relation') && element.center) {
      coordinates = [element.center.lon, element.center.lat];
    }

    if (coordinates && name && name.toLowerCase() !== 'unknown') {
      features.push({
        type: 'Feature',
        properties: {
          name: name,
          type: 'Fire Station'
        },
        geometry: {
          type: 'Point',
          coordinates: coordinates
        }
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features: features
  };
};

export const dhakaFireStations: FeatureCollection = parseOsmDataToGeoJSON(rawFireStationData);

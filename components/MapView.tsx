

import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Circle } from 'react-leaflet';
import type { MapLayer, AirbaseLocation } from '../types';
import type { Feature } from 'geojson';
import L from 'leaflet';
import { findNearest, findNearestAirbase, formatDistance } from '../utils/geo';
import ReactDOMServer from 'react-dom/server';
import { Plane, MapPin, School, Hospital, Flame } from 'lucide-react';
import MapLegend from './MapLegend';

const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const defaultPolygonStyle = {
  color: '#0891b2', weight: 2, opacity: 0.8, fillColor: '#22d3ee', fillOpacity: 0.4,
};

const styles = {
  default: { point: { radius: 6, fillColor: "#06b6d4", color: "#0e7490", weight: 2, opacity: 1, fillOpacity: 0.8 }, polygon: defaultPolygonStyle },
};

// --- Heatmap Styling ---
const getColorForIntensity = (intensity: number) => {
    // Transition from a light pink to a vibrant magenta for a "hot" effect
    const lowColor = { r: 249, g: 168, b: 212 }; // A light pink (tailwind pink-300)
    const highColor = { r: 190, g: 24, b: 93 };  // A deep magenta (tailwind pink-700)
    
    // Linear interpolation for a smooth gradient
    const r = lowColor.r + (highColor.r - lowColor.r) * intensity;
    const g = lowColor.g + (highColor.g - lowColor.g) * intensity;
    const b = lowColor.b + (highColor.b - lowColor.b) * intensity;

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const styleHeatmapPoint = (feature: Feature) => {
    const intensity = feature.properties?.intensity || 0;
    // Non-linear opacity scaling to make hotspots more vibrant
    // Using Math.pow makes the opacity increase faster for higher intensity values
    const opacity = 0.1 + Math.pow(intensity, 2) * 0.8; 
    return {
        radius: 3,
        fillColor: getColorForIntensity(intensity),
        color: 'transparent', // No border color for a smoother look
        weight: 0,
        opacity: opacity,
        fillOpacity: opacity,
    };
};

// --- Custom Icon Logic ---
const createAirbaseIcon = () => L.divIcon({
  html: ReactDOMServer.renderToString(
    <div className="bg-slate-800/80 p-1 rounded-full shadow-lg">
      <Plane size={24} color="#f0f9ff" />
    </div>
  ),
  className: 'bg-transparent border-0',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const createSectorIcon = (name: string) => {
    const number = name.match(/\d+/)?.[0] || '';
    return L.divIcon({
        html: ReactDOMServer.renderToString(
            <div className="relative flex items-center justify-center">
                <MapPin size={32} color="#4f46e5" fill="#c7d2fe"/>
                <span className="absolute text-white text-xs font-bold" style={{top: '6px'}}>{number}</span>
            </div>
        ),
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

const createKeyAreaIcon = () => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(
            <div className="relative flex items-center justify-center">
                 <MapPin size={32} color="#ec4899" fill="#fbcfe8"/>
            </div>
        ),
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};


const createSchoolIcon = () => L.divIcon({
    html: ReactDOMServer.renderToString(
      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md">
        <School size={14} color="white" />
      </div>
    ),
    className: 'bg-transparent border-0',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const createHospitalIcon = () => L.divIcon({
    html: ReactDOMServer.renderToString(
      <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-md">
        <Hospital size={14} color="white" />
      </div>
    ),
    className: 'bg-transparent border-0',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const createFireStationIcon = () => L.divIcon({
    html: ReactDOMServer.renderToString(
      <div className="flex items-center justify-center w-6 h-6 bg-orange-600 rounded-full border-2 border-white shadow-md">
        <Flame size={14} color="white" />
      </div>
    ),
    className: 'bg-transparent border-0',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});


const pointToLayer = (layer: MapLayer) => (feature: GeoJSON.Feature, latlng: L.LatLng): L.Layer => {
  // Use unique ID for robust identification of the heatmap layer
  if (layer.id === 'traffic-heatmap') {
      return L.circleMarker(latlng, styleHeatmapPoint(feature));
  }
  
  // Fallback to name-based identification for other layers
  const name = layer.name.toLowerCase();
  if (name.includes('air base')) return L.marker(latlng, { icon: createAirbaseIcon() });
  if (name.includes('fire station')) return L.marker(latlng, { icon: createFireStationIcon() });
  if (name.includes('school')) return L.marker(latlng, { icon: createSchoolIcon() });
  if (name.includes('hospital')) return L.marker(latlng, { icon: createHospitalIcon() });
  if (name.includes('sector')) return L.marker(latlng, { icon: createSectorIcon(feature.properties?.name || '') });
  if (name.includes('key areas')) return L.marker(latlng, { icon: createKeyAreaIcon() });
  
  const style = styles.default.point;
  return L.circleMarker(latlng, style);
};

const styleFeature = () => styles.default.polygon;

const createOnEachFeature = (
    currentLayer: MapLayer,
    allLayers: MapLayer[],
    airbases: AirbaseLocation[],
    onSelectSector: (sector: Feature) => void,
    onSelectAirbase: (airbaseName: string) => void
) => (feature: Feature, layer: L.Layer) => {
  if (currentLayer.id === 'traffic-heatmap') {
      return;
  }
  
  const layerName = currentLayer.name.toLowerCase();
  const name = feature.properties?.name;

  if (name) {
    if (layerName.includes('sector')) {
      layer.on('click', () => onSelectSector(feature));
      // Sectors open the inspector, so they don't get a standard popup.
      return; 
    }

    let popupContent = `<strong>${name}</strong>`;
    
    if (layerName.includes('school')) {
        const details = [];
        
        const fireStationLayers = allLayers.filter(l => l.id.includes('fire-station'));
        const nearestFireStation = findNearest(feature, fireStationLayers);
        if (nearestFireStation.feature?.properties?.name) {
            details.push(`<strong>Nearest Fire Station:</strong> ${nearestFireStation.feature.properties.name} (${formatDistance(nearestFireStation.distance)})`);
        }

        const nearestAirbase = findNearestAirbase(feature, airbases);
        if (nearestAirbase.airbase) {
            details.push(`<strong>Nearest Airbase:</strong> ${nearestAirbase.airbase.name} (${formatDistance(nearestAirbase.distance)})`);
        }

        const hospitalLayers = allLayers.filter(l => l.id.includes('hospitals'));
        const nearestHospital = findNearest(feature, hospitalLayers);
        if (nearestHospital.feature?.properties?.name) {
            details.push(`<strong>Nearest Hospital:</strong> ${nearestHospital.feature.properties.name} (${formatDistance(nearestHospital.distance)})`);
        }
        
        if (details.length > 0) {
            popupContent += `<br/><hr class="my-1 border-gray-500"/>` + details.join('<br/>');
        }

    } else if (layerName.includes('hospital')) {
        const nearest = findNearestAirbase(feature, airbases);
        if (nearest.airbase) {
            popupContent += `<br/><hr class="my-1 border-gray-500"/><strong>Nearest Airbase:</strong> ${nearest.airbase.name} (${formatDistance(nearest.distance)})`;
        }
    }

    if (layerName.includes('air base')) {
      layer.on('click', () => onSelectAirbase(name));
    }
    
    // Key areas and other layers will just get a simple popup with their name.
    layer.bindPopup(popupContent);
  }
};


interface MapFlyToControllerProps {
    flyTo: { coordinates: [number, number], zoom: number } | null;
}

const MapFlyToController: React.FC<MapFlyToControllerProps> = ({ flyTo }) => {
    const map = useMap();
    React.useEffect(() => {
        if (flyTo) {
            map.flyTo(flyTo.coordinates, flyTo.zoom);
        }
    }, [flyTo, map]);
    return null;
}


interface MapViewProps {
    layers: MapLayer[];
    airbases: AirbaseLocation[];
    selectedSector: Feature | null;
    selectedAirbase: AirbaseLocation | null;
    onSelectSector: (sector: Feature | null) => void;
    onSelectAirbase: (airbaseName: string) => void;
    flyTo: { coordinates: [number, number], zoom: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ layers, airbases, selectedSector, selectedAirbase, onSelectSector, onSelectAirbase, flyTo }) => {
  const visibleLayers = layers.filter(l => l.isVisible);

  const selectedSectorCoords = selectedSector?.geometry?.type === 'Point' 
    ? [selectedSector.geometry.coordinates[1], selectedSector.geometry.coordinates[0]] as [number, number]
    : null;
    
  return (
    <MapContainer center={[23.8103, 90.4125]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
      <MapFlyToController flyTo={flyTo} />
      
      {/* Dynamic Layers */}
      {visibleLayers.map(layer => (
        <GeoJSON 
          key={layer.id} 
          data={layer.data}
          pointToLayer={pointToLayer(layer)}
          onEachFeature={createOnEachFeature(layer, layers, airbases, onSelectSector, onSelectAirbase)}
          style={styleFeature}
        />
      ))}
      
       {selectedSectorCoords && (
        <Circle 
            center={selectedSectorCoords} 
            radius={200} 
            pathOptions={{ color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.3, weight: 2 }}
        />
       )}

       {selectedAirbase && (
         <Circle
            center={selectedAirbase.coordinates}
            radius={7000} // 7km
            pathOptions={{ color: 'red', weight: 2, fillColor: 'orange', fillOpacity: 0.2 }}
         >
            <Popup>7km radius around {selectedAirbase.name}</Popup>
         </Circle>
       )}
       <MapLegend />
    </MapContainer>
  );
};

export default MapView;
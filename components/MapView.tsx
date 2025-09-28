


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
  color: '#047857', weight: 2, opacity: 0.8, fillColor: '#10b981', fillOpacity: 0.4,
};

const styles = {
  default: { point: { radius: 6, fillColor: "#10b981", color: "#047857", weight: 2, opacity: 1, fillOpacity: 0.8 }, polygon: defaultPolygonStyle },
};

// --- Heatmap Styling ---
const getTrafficColor = (intensity: number) => {
    const lowColor = { r: 249, g: 168, b: 212 }; // tailwind pink-300
    const highColor = { r: 190, g: 24, b: 93 };  // tailwind pink-700
    const r = lowColor.r + (highColor.r - lowColor.r) * intensity;
    const g = lowColor.g + (highColor.g - lowColor.g) * intensity;
    const b = lowColor.b + (highColor.b - lowColor.b) * intensity;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const styleTrafficPoint = (feature: Feature) => {
    const intensity = feature.properties?.intensity || 0;
    const opacity = 0.1 + Math.pow(intensity, 2) * 0.8; 
    return { radius: 3, fillColor: getTrafficColor(intensity), color: 'transparent', weight: 0, opacity: opacity, fillOpacity: opacity };
};

const getLSTColor = (intensity: number) => {
    if (intensity < 0.5) {
        const r = 96 + (253 - 96) * (intensity * 2);
        const g = 165 + (224 - 165) * (intensity * 2);
        const b = 250 - (250 - 15) * (intensity * 2);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    } else {
        const r = 253 + (239 - 253) * ((intensity - 0.5) * 2);
        const g = 224 - (224 - 68) * ((intensity - 0.5) * 2);
        const b = 15 - (15 - 68) * ((intensity - 0.5) * 2);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
}

const styleLSTPoint = (feature: Feature) => {
    const intensity = feature.properties?.intensity || 0;
    const opacity = 0.1 + Math.pow(intensity, 2) * 0.8; 
    return { radius: 4, fillColor: getLSTColor(intensity), color: 'transparent', weight: 0, opacity: opacity, fillOpacity: opacity };
};

const getAODColor = (intensity: number) => {
    const r = 255 - 150 * intensity;
    const g = 235 - 180 * intensity;
    const b = 150 - 150 * intensity;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const getNDVIColor = (ndvi: number) => {
    const clampedNdvi = Math.max(0, Math.min(1, ndvi));
    const r = 167 - 140 * clampedNdvi;
    const g = 242 - 140 * clampedNdvi;
    const b = 158 - 140 * clampedNdvi;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// --- Custom Icon Logic ---
const createAirbaseIcon = () => L.divIcon({
  html: ReactDOMServer.renderToString(
    <div className="bg-white/80 p-1 rounded-full shadow-lg">
      <Plane size={24} color="#047857" />
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
                <MapPin size={32} color="#059669" fill="#6ee7b7"/>
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
                 <MapPin size={32} color="#0d9488" fill="#5eead4"/>
            </div>
        ),
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};


const createSchoolIcon = () => L.divIcon({
    html: ReactDOMServer.renderToString(
      <div className="flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow-md">
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
  if (layer.id === 'traffic-heatmap') return L.circleMarker(latlng, styleTrafficPoint(feature));
  if (layer.id === 'lst-heatmap') return L.circleMarker(latlng, styleLSTPoint(feature));
  
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

const styleFeature = (layer: MapLayer) => (feature: Feature | undefined) => {
    if (!feature) return {};
    const layerName = layer.name.toLowerCase();
    if (layerName.includes('particulate')) { // AOD
        const intensity = feature.properties?.aod_intensity || 0;
        return { ...defaultPolygonStyle, fillColor: getAODColor(intensity), fillOpacity: 0.5, color: '#ca8a04', weight: 1 };
    }
    if (layerName.includes('greenness')) { // NDVI
        const ndvi = feature.properties?.ndvi || 0;
        return { ...defaultPolygonStyle, fillColor: getNDVIColor(ndvi), fillOpacity: 0.6, color: '#16a34a', weight: 1 };
    }
    return styles.default.polygon;
};


const createOnEachFeature = (
    currentLayer: MapLayer,
    allLayers: MapLayer[],
    airbases: AirbaseLocation[],
    onSelectSector: (sector: Feature) => void,
    onSelectAirbase: (airbaseName: string) => void
) => (feature: Feature, layer: L.Layer) => {
  if (currentLayer.id.includes('heatmap')) return;
  
  const layerName = currentLayer.name.toLowerCase();
  const name = feature.properties?.name;

  if (name) {
    if (layerName.includes('sector')) {
      layer.on('click', () => onSelectSector(feature));
      return; 
    }

    let popupContent = `<strong>${name}</strong>`;
    
    if (layerName.includes('school')) {
        const details = [];
        const fireStationLayers = allLayers.filter(l => l.id.includes('fire-station'));
        const nearestFireStation = findNearest(feature, fireStationLayers);
        if (nearestFireStation.feature?.properties?.name) details.push(`<strong>Nearest Fire Station:</strong> ${nearestFireStation.feature.properties.name} (${formatDistance(nearestFireStation.distance)})`);
        const nearestAirbase = findNearestAirbase(feature, airbases);
        if (nearestAirbase.airbase) details.push(`<strong>Nearest Airbase:</strong> ${nearestAirbase.airbase.name} (${formatDistance(nearestAirbase.distance)})`);
        const hospitalLayers = allLayers.filter(l => l.id.includes('hospitals'));
        const nearestHospital = findNearest(feature, hospitalLayers);
        if (nearestHospital.feature?.properties?.name) details.push(`<strong>Nearest Hospital:</strong> ${nearestHospital.feature.properties.name} (${formatDistance(nearestHospital.distance)})`);
        if (details.length > 0) popupContent += `<br/><hr class="my-1 border-gray-500"/>` + details.join('<br/>');
    } else if (layerName.includes('hospital')) {
        const nearest = findNearestAirbase(feature, airbases);
        if (nearest.airbase) popupContent += `<br/><hr class="my-1 border-gray-500"/><strong>Nearest Airbase:</strong> ${nearest.airbase.name} (${formatDistance(nearest.distance)})`;
    } else if (layerName.includes('particulate')) {
        const intensity = feature.properties?.aod_intensity;
        popupContent += `<br/><hr class="my-1 border-gray-500"/><strong>AOD Intensity:</strong> ${intensity?.toFixed(2)}`;
    } else if (layerName.includes('greenness')) {
        const ndvi = feature.properties?.ndvi;
        popupContent += `<br/><hr class="my-1 border-gray-500"/><strong>NDVI Value:</strong> ${ndvi?.toFixed(2)}`;
    }


    if (layerName.includes('air base')) {
      layer.on('click', () => onSelectAirbase(name));
    }
    
    layer.bindPopup(popupContent);
    
    // Add hover effect for polygons
    if (layer instanceof L.Polygon) {
        layer.on('mouseover', () => layer.setStyle({ weight: 4, color: '#047857' }));
        layer.on('mouseout', () => layer.setStyle(styleFeature(currentLayer)(feature)));
    }
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
          style={styleFeature(layer)}
        />
      ))}
      
       {selectedSectorCoords && (
        <Circle 
            center={selectedSectorCoords} 
            radius={200} 
            pathOptions={{ color: '#059669', fillColor: '#34d399', fillOpacity: 0.3, weight: 2 }}
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
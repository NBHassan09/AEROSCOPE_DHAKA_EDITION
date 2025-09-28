import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Circle } from 'react-leaflet';
import type { MapLayer, AirbaseLocation, OverlayTileLayer } from '../types';
import type { Feature } from 'geojson';
import L from 'leaflet';
import { findNearest, findNearestAirbase, formatDistance } from '../utils/geo';
import ReactDOMServer from 'react-dom/server';
import { Plane, MapPin, School, Hospital, Flame } from 'lucide-react';
import MapLegend from './MapLegend';

const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const defaultPolygonStyle = {
  color: '#047857', weight: 2, opacity: 0.8, fillColor: '#10b981', fillOpacity: 0.4,
};


const styles = {
  default: { point: { radius: 6, fillColor: "#10b981", color: "#047857", weight: 2, opacity: 1, fillOpacity: 0.8 }, polygon: defaultPolygonStyle },
};

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
    return styles.default.polygon;
};


const createOnEachFeature = (
    currentLayer: MapLayer,
    allLayers: MapLayer[],
    airbases: AirbaseLocation[],
    onSelectSector: (sector: Feature) => void,
    onSelectAirbase: (airbaseName: string) => void
) => (feature: Feature, layer: L.Layer) => {
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
    }

    if (layerName.includes('air base')) {
      layer.on('click', () => onSelectAirbase(name));
    }
    
    layer.bindPopup(popupContent);
    
    // Add hover effect for polygons
    if (layer instanceof L.Polygon) {
        const hoverStyle = { weight: 4, color: '#047857' };
        layer.on('mouseover', () => layer.setStyle(hoverStyle));
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
    streetLayer: OverlayTileLayer;
    dynamicWorldLayer: OverlayTileLayer;
    waterNaturalLayer: OverlayTileLayer;
    airbases: AirbaseLocation[];
    selectedSector: Feature | null;
    selectedAirbase: AirbaseLocation | null;
    onSelectSector: (sector: Feature | null) => void;
    onSelectAirbase: (airbaseName: string) => void;
    flyTo: { coordinates: [number, number], zoom: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ layers, streetLayer, dynamicWorldLayer, waterNaturalLayer, airbases, selectedSector, selectedAirbase, onSelectSector, onSelectAirbase, flyTo }) => {
  const visibleLayers = layers.filter(l => l.isVisible);

  const selectedSectorCoords = selectedSector?.geometry?.type === 'Point' 
    ? [selectedSector.geometry.coordinates[1], selectedSector.geometry.coordinates[0]] as [number, number]
    : null;
    
  return (
    <MapContainer center={[23.8103, 90.4125]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
      <MapFlyToController flyTo={flyTo} />

      {streetLayer.isVisible && streetLayer.tileUrl && (
        <TileLayer
          url={streetLayer.tileUrl}
          opacity={streetLayer.opacity}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          zIndex={20}
          className="street-highlight-layer"
        />
      )}
      
      {waterNaturalLayer.isVisible && waterNaturalLayer.tileUrl && (
        <TileLayer
          url={waterNaturalLayer.tileUrl}
          opacity={waterNaturalLayer.opacity}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          zIndex={15}
        />
      )}

      {dynamicWorldLayer.isVisible && dynamicWorldLayer.tileUrl && (
        <TileLayer
          url={dynamicWorldLayer.tileUrl}
          opacity={dynamicWorldLayer.opacity}
          attribution="© Google & WRI (Dynamic World). Tiles via Resource Watch."
          zIndex={10}
        />
      )}

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
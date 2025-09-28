import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidvv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import SectorInspector from './components/SectorInspector';
import AnalysisPage from './components/AnalysisPage';
import MethodologyPage from './components/MethodologyPage';
import AboutPage from './components/AboutPage';
import type { MapLayer, AiResponseMessage, SectorInfo, AirbaseLocation, OverlayTileLayer } from './types';
import { generateGeoData } from './services/geminiService';
import { findNearest } from './utils/geo';
import type { FeatureCollection, Feature } from 'geojson';

import { dhakaSchools } from './data/schools';
import { dhakaHospitals } from './data/hospitals';
import { uttaraSectors } from './data/uttaraSectors';
import { keyAreas } from './data/keyAreas';
import { dhakaFireStations } from './data/fireStations';


const airbases: AirbaseLocation[] = [
    { name: 'Hazrat Shahjalal Int. Airport (HSIA)', coordinates: [23.8436, 90.3973] },
    { name: 'Tejgaon Air Base', coordinates: [23.7800, 90.4090] },
    { name: 'Mirpur Cantonment', coordinates: [23.8150, 90.3660] },
];

const airbasesGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: airbases.map(ab => ({
        type: 'Feature',
        properties: { name: ab.name },
        geometry: {
            type: 'Point',
            coordinates: [ab.coordinates[1], ab.coordinates[0]] // [lng, lat] for GeoJSON
        }
    }))
};

const App: React.FC = () => {

  const [layers, setLayers] = useState<MapLayer[]>([
     {
      id: 'airbases-dhaka',
      name: 'Air Bases in Dhaka',
      data: airbasesGeoJSON,
      isVisible: true,
    },
    {
      id: 'fire-stations-dhaka',
      name: 'Fire Stations in Dhaka',
      data: dhakaFireStations,
      isVisible: false,
    },
    {
      id: 'schools-dhaka',
      name: 'Schools in Dhaka',
      data: dhakaSchools,
      isVisible: false,
    },
    {
      id: 'hospitals-dhaka',
      name: 'Hospitals in Dhaka',
      data: dhakaHospitals,
      isVisible: false,
    },
    {
      id: 'uttara-sectors',
      name: 'Uttara Sectors',
      data: uttaraSectors,
      isVisible: false,
    },
    {
      id: 'key-areas-dhaka',
      name: 'Key Areas in Dhaka',
      data: keyAreas,
      isVisible: false,
    },
  ]);

  const [chatHistory, setChatHistory] = useState<AiResponseMessage[]>([
      {
          id: uuidvv4(),
          sender: 'bot',
          content: "Welcome to AeroScope- Dhaka Edition! This tool helps analyze the urban landscape around key airbases. Select an airbase to begin.",
      }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Feature | null>(null);
  const [sectorInfo, setSectorInfo] = useState<SectorInfo | null>(null);
  const [flyTo, setFlyTo] = useState<{ coordinates: [number, number], zoom: number } | null>(null);
  const [page, setPage] = useState<'map' | 'analysis' | 'methodology' | 'about'>('about');
  const [selectedAirbase, setSelectedAirbase] = useState<AirbaseLocation | null>(null);
  
  const [streetLayer, setStreetLayer] = useState<OverlayTileLayer>({
    id: 'street-highlight-layer',
    name: 'Street Highlights',
    isVisible: false,
    opacity: 0.8,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  });

  const [waterNaturalLayer, setWaterNaturalLayer] = useState<OverlayTileLayer>({
    id: 'water-natural-layer',
    name: 'Water & Natural Spaces',
    isVisible: false,
    opacity: 0.7,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
  });

  const [dynamicWorldLayer, setDynamicWorldLayer] = useState<OverlayTileLayer>({
    id: 'dynamic-world-layer',
    name: 'Dynamic World Land Cover',
    isVisible: false,
    opacity: 0.8,
    tileUrl: null,
  });

  useEffect(() => {
    const fetchDynamicWorldTileUrl = async () => {
      try {
        const resp = await fetch('https://api.resourcewatch.org/v1/dataset?search=dynamic%20world&includes=layer,metadata');
        if (!resp.ok) {
          throw new Error('Resource Watch dataset search failed: ' + resp.status);
        }
        const ds = await resp.json();
        
        let tileUrl: string | null = null;

        const extractTilesFromLayerObj = (layerObj: any) => {
          const lc = layerObj?.attributes?.layerConfig;
          const tiles = lc?.source?.tiles || lc?.body?.source?.tiles;
          return Array.isArray(tiles) && tiles[0] ? tiles[0] : null;
        };

        if (Array.isArray(ds?.data)) {
          for (const d of ds.data) {
            const layers = d?.attributes?.layer;
            if (Array.isArray(layers)) {
              for (const L of layers) {
                const maybeTiles = extractTilesFromLayerObj(L);
                if (maybeTiles && /{z}.*{x}.*{y}/i.test(maybeTiles)) {
                  tileUrl = maybeTiles;
                  break;
                }
              }
            }
            if (tileUrl) break;
          }
        }
        
        if (tileUrl) {
          setDynamicWorldLayer(prev => ({ ...prev, tileUrl }));
        } else {
          console.error("Could not find Dynamic World tiles in Resource Watch API response.");
        }
      } catch (err) {
        console.error("Failed to load tiles/metadata from Resource Watch:", err);
      }
    };
    fetchDynamicWorldTileUrl();
  }, []);

  const handleSelectSector = useCallback((sector: Feature | null) => {
    setSelectedAirbase(null); // Hide circle when inspector opens
    if (!sector) {
      setSelectedSector(null);
      setSectorInfo(null);
      return;
    }

    setSelectedSector(sector);
    const schoolLayers = layers.filter(l => l.id.includes('schools'));
    const hospitalLayers = layers.filter(l => l.id.includes('hospitals'));
    
    const nearestSchool = findNearest(sector, schoolLayers);
    const nearestHospital = findNearest(sector, hospitalLayers);

    setSectorInfo({
        nearestSchool,
        nearestHospital
    });
  }, [layers]);

  const handleFlyTo = useCallback((location: AirbaseLocation) => {
    handleSelectSector(null); // Close inspector if open before flying
    setFlyTo({ coordinates: location.coordinates, zoom: 15 });
    setSelectedAirbase(location);
    
    setLayers(prevLayers => 
        prevLayers.map(layer => {
          if (layer.id.includes('airbase')) {
            return layer; // Keep airbase layer as is
          }
          if (layer.id === 'schools-dhaka' || layer.id === 'hospitals-dhaka' || layer.id === 'key-areas-dhaka') {
            return { ...layer, isVisible: true }; // Show schools, hospitals, and key areas
          }
          if (layer.id === 'uttara-sectors') {
             // Only show sectors for HSIA
            return { ...layer, isVisible: location.name.includes('HSIA') };
          }
          return layer;
        })
    );
  }, [handleSelectSector]);

  const handleSelectAirbaseFromMap = useCallback((airbaseName: string) => {
    const airbase = airbases.find(ab => ab.name === airbaseName);
    if (airbase) {
        // We call flyTo as it also handles setting the selected airbase and layer visibility
        handleFlyTo(airbase);
    }
  }, [handleFlyTo]);

  const handleClearAirbaseSelection = useCallback(() => {
    setSelectedAirbase(null);
    handleSelectSector(null);
    setLayers(prevLayers =>
      prevLayers.map(layer => {
        if (layer.id === 'airbases-dhaka') {
          // Keep the base airbase layer visible
          return { ...layer, isVisible: true };
        }
        // Hide all other layers, except for newly added AI layers
        const isAiLayer = !['fire-stations-dhaka', 'schools-dhaka', 'hospitals-dhaka', 'uttara-sectors', 'key-areas-dhaka', 'airbases-dhaka'].includes(layer.id);
        if (isAiLayer) {
            return layer;
        }
        return { ...layer, isVisible: false };
      })
    );
  }, [handleSelectSector]);

  const handleAiQuery = useCallback(async (prompt: string) => {
    setIsLoading(true);

    const userMessage: AiResponseMessage = {
      id: uuidvv4(),
      sender: 'user',
      content: prompt,
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // Capture context BEFORE clearing state
      const visibleLayerNames = layers.filter(l => l.isVisible).map(l => l.name);
      let context = '';
      if (visibleLayerNames.length > 0) {
        context += `Context: The following data layers are currently visible on the map: ${visibleLayerNames.join(', ')}.`;
      } else {
        context += 'Context: No data layers are currently visible on the map.';
      }

      if (selectedAirbase) {
        context += ` The user is focused on the area around ${selectedAirbase.name}.`;
      }

      const fullPrompt = `${context}\n\nUser query: "${prompt}"`;
      
      const result = await generateGeoData(fullPrompt);
      const botMessage: AiResponseMessage = {
        id: uuidvv4(),
        sender: 'bot',
        content: result.message || 'Here is the information you requested.',
        action: result.action,
      };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error querying GeoAI:", error);
      const errorMessage: AiResponseMessage = {
        id: uuidvv4(),
        sender: 'bot',
        content: "Sorry, I encountered an error. Please try a different query.",
        action: 'ERROR',
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [layers, selectedAirbase]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers(layers =>
      layers.map(layer =>
        layer.id === layerId ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setLayers(layers => layers.filter(layer => layer.id !== layerId));
  }, []);

  const toggleStreetLayerVisibility = useCallback(() => {
    setStreetLayer(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setStreetLayerOpacity = useCallback((opacity: number) => {
    setStreetLayer(prev => ({ ...prev, opacity }));
  }, []);

  const toggleWaterNaturalLayerVisibility = useCallback(() => {
    setWaterNaturalLayer(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setWaterNaturalLayerOpacity = useCallback((opacity: number) => {
    setWaterNaturalLayer(prev => ({ ...prev, opacity }));
  }, []);

  const toggleDynamicWorldVisibility = useCallback(() => {
    setDynamicWorldLayer(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setDynamicWorldOpacity = useCallback((opacity: number) => {
    setDynamicWorldLayer(prev => ({ ...prev, opacity }));
  }, []);
  
  const renderPage = () => {
    switch(page) {
      case 'map':
        return (
          <>
            <MapView 
                layers={layers}
                streetLayer={streetLayer}
                dynamicWorldLayer={dynamicWorldLayer}
                waterNaturalLayer={waterNaturalLayer}
                airbases={airbases}
                selectedSector={selectedSector}
                selectedAirbase={selectedAirbase}
                onSelectSector={handleSelectSector}
                onSelectAirbase={handleSelectAirbaseFromMap}
                flyTo={flyTo}
            />
            {selectedSector && sectorInfo && (
                <SectorInspector 
                    sector={selectedSector}
                    info={sectorInfo}
                    onClose={() => handleSelectSector(null)}
                />
            )}
          </>
        );
      case 'analysis':
        return <AnalysisPage />;
      case 'methodology':
        return <MethodologyPage />;
      case 'about':
        return <AboutPage />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800">
      <Sidebar
        page={page}
        onSetPage={setPage}
        airbases={airbases}
        layers={layers}
        chatHistory={chatHistory}
        isLoading={isLoading}
        onAiQuery={handleAiQuery}
        onToggleLayer={toggleLayerVisibility}
        onRemoveLayer={removeLayer}
        onFlyTo={handleFlyTo}
        selectedAirbase={selectedAirbase}
        onClearAirbaseSelection={handleClearAirbaseSelection}
        streetLayer={streetLayer}
        onToggleStreetLayer={toggleStreetLayerVisibility}
        onSetStreetLayerOpacity={setStreetLayerOpacity}
        dynamicWorldLayer={dynamicWorldLayer}
        onToggleDynamicWorld={toggleDynamicWorldVisibility}
        onSetDynamicWorldOpacity={setDynamicWorldOpacity}
        waterNaturalLayer={waterNaturalLayer}
        onToggleWaterNaturalLayer={toggleWaterNaturalLayerVisibility}
        onSetWaterNaturalLayerOpacity={setWaterNaturalLayerOpacity}
      />
      <main className="flex-1 h-full relative">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
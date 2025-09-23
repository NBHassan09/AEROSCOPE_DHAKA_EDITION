

import React, { useState, useCallback, useMemo } from 'react';
import { v4 as uuidvv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import SectorInspector from './components/SectorInspector';
import AnalysisPage from './components/AnalysisPage';
import MethodologyPage from './components/MethodologyPage';
import type { MapLayer, AiResponseMessage, SectorInfo, AirbaseLocation } from './types';
import { generateGeoData } from './services/geminiService';
import { findNearest, generateRandomPointInRadius } from './utils/geo';
import type { FeatureCollection, Feature } from 'geojson';

import { dhakaSchools } from './data/schools';
import { dhakaHospitals } from './data/hospitals';
import { uttaraSectors } from './data/uttaraSectors';
import { keyAreas } from './data/keyAreas';
import { environmentalData } from './data/environmentalData';
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

  const trafficHeatmapLayer: MapLayer = useMemo(() => {
    const features: Feature[] = [];
    
    // Get all NTL values to find min/max for normalization
    const allNtlValues = Object.values(environmentalData).flat().map(d => d.ntl).filter(ntl => ntl > 0);
    const minNtl = Math.min(...allNtlValues);
    const maxNtl = Math.max(...allNtlValues);

    airbases.forEach(airbase => {
        // Use the latest available NTL data for each airbase
        const airbaseData = environmentalData[airbase.name];
        if (!airbaseData || airbaseData.length === 0) return;
        
        const latestDataPoint = airbaseData[airbaseData.length - 1];
        const ntlValue = latestDataPoint.ntl;

        // Normalize NTL value to a 0-1 intensity scale
        const intensity = (ntlValue - minNtl) / (maxNtl - minNtl);
        
        // Number of points to generate is proportional to NTL intensity (200 to 1500 points)
        const numPoints = Math.floor(200 + intensity * 1300);

        for (let i = 0; i < numPoints; i++) {
            const randomPoint = generateRandomPointInRadius(airbase.coordinates, 7000); // 7km radius
            randomPoint.properties = { intensity }; // Add intensity for styling
            features.push(randomPoint);
        }
    });

    return {
        id: 'traffic-heatmap',
        name: 'Traffic Congestion Heatmap',
        isVisible: false,
        data: {
            type: 'FeatureCollection',
            features: features,
        }
    };
  }, []);

  const [layers, setLayers] = useState<MapLayer[]>([
     {
      id: 'airbases-dhaka',
      name: 'Air Bases in Dhaka',
      data: airbasesGeoJSON,
      isVisible: true,
    },
    trafficHeatmapLayer,
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
    }
  ]);

  const [chatHistory, setChatHistory] = useState<AiResponseMessage[]>([
      {
          id: uuidvv4(),
          sender: 'bot',
          content: "Welcome to the Dhaka Air Base Planner! This tool helps analyze the urban landscape around key airbases. Select an airbase to begin.",
      }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Feature | null>(null);
  const [sectorInfo, setSectorInfo] = useState<SectorInfo | null>(null);
  const [flyTo, setFlyTo] = useState<{ coordinates: [number, number], zoom: number } | null>(null);
  const [page, setPage] = useState<'map' | 'analysis' | 'methodology'>('map');
  const [selectedAirbase, setSelectedAirbase] = useState<AirbaseLocation | null>(null);

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

  const handleAiQuery = useCallback(async (prompt: string) => {
    setIsLoading(true);
    handleSelectSector(null); // Close inspector on new query
    setSelectedAirbase(null); // Hide circle on new query

    const userMessage: AiResponseMessage = {
      id: uuidvv4(),
      sender: 'user',
      content: prompt,
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // The expert instruction has been moved to the system instruction in geminiService.ts for better performance and clarity.
      const result = await generateGeoData(prompt);
      const botMessage: AiResponseMessage = {
        id: uuidvv4(),
        sender: 'bot',
        content: result.message || 'Here is the data you requested.',
        action: result.action,
      };
      setChatHistory(prev => [...prev, botMessage]);

      if (result.action === 'ADD_LAYER') {
        if (result.geojsonData && Array.isArray(result.geojsonData.features)) {
          const newLayer: MapLayer = {
            id: uuidvv4(),
            name: result.layerName || 'New Layer',
            data: result.geojsonData,
            isVisible: true,
          };
          setLayers(prev => [...prev, newLayer]);
        } else {
          console.error("AI returned ADD_LAYER action but geojsonData was invalid.", result);
          const errorMessage: AiResponseMessage = {
            id: uuidvv4(),
            sender: 'bot',
            content: "I tried to generate map data, but it came back in a format I couldn't read. Please try rephrasing your request.",
            action: 'ERROR',
          };
          setChatHistory(prev => [...prev, errorMessage]);
        }
      }
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
  }, [handleSelectSector]);

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
  
  const renderPage = () => {
    switch(page) {
      case 'map':
        return (
          <>
            <MapView 
                layers={layers}
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
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-200">
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
      />
      <main className="flex-1 h-full relative">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import type { MapLayer, AiResponseMessage, AirbaseLocation, OverlayTileLayer } from '../types';
import AiChat from './AiChat';
import LayerList from './LayerList';
import AirbaseList from './AirbaseList';
import OverlayLayerControl from './OverlayLayerControl';
import { Bot, MessageSquarePlus, Lightbulb, Globe, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface SidebarProps {
  page: 'map' | 'analysis' | 'methodology' | 'about';
  onSetPage: (page: 'map' | 'analysis' | 'methodology' | 'about') => void;
  airbases: AirbaseLocation[];
  layers: MapLayer[];
  chatHistory: AiResponseMessage[];
  isLoading: boolean;
  onAiQuery: (prompt: string, isSuggestion?: boolean) => void;
  onToggleLayer: (layerId: string) => void;
  onRemoveLayer: (layerId:string) => void;
  onFlyTo: (location: AirbaseLocation) => void;
  selectedAirbase: AirbaseLocation | null;
  onClearAirbaseSelection: () => void;
  satelliteLayer: OverlayTileLayer;
  onToggleSatelliteLayer: () => void;
  onSetSatelliteLayerOpacity: (opacity: number) => void;
  streetLayer: OverlayTileLayer;
  onToggleStreetLayer: () => void;
  onSetStreetLayerOpacity: (opacity: number) => void;
  dynamicWorldLayer: OverlayTileLayer;
  onToggleDynamicWorld: () => void;
  onSetDynamicWorldOpacity: (opacity: number) => void;
  waterNaturalLayer: OverlayTileLayer;
  onToggleWaterNaturalLayer: () => void;
  onSetWaterNaturalLayerOpacity: (opacity: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  page,
  onSetPage,
  airbases,
  layers,
  chatHistory,
  isLoading,
  onAiQuery,
  onToggleLayer,
  onRemoveLayer,
  onFlyTo,
  selectedAirbase,
  onClearAirbaseSelection,
  satelliteLayer,
  onToggleSatelliteLayer,
  onSetSatelliteLayerOpacity,
  streetLayer,
  onToggleStreetLayer,
  onSetStreetLayerOpacity,
  dynamicWorldLayer,
  onToggleDynamicWorld,
  onSetDynamicWorldOpacity,
  waterNaturalLayer,
  onToggleWaterNaturalLayer,
  onSetWaterNaturalLayerOpacity,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOverlaysExpanded, setIsOverlaysExpanded] = useState(true);
  const [isDataLayersExpanded, setIsDataLayersExpanded] = useState(true);

  return (
    <aside className="w-96 h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col shadow-2xl relative overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot size={28} className="text-emerald-500"/>
          <h1 className="text-xl font-bold text-gray-900 tracking-wider">AeroScope- Dhaka Edition</h1>
        </div>
      </div>
      
      {/* Page Navigation */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex space-x-2">
            <button
                onClick={() => onSetPage('map')}
                title="Map View"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'map' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
                Map
            </button>
            <button
                onClick={() => onSetPage('analysis')}
                title="Analysis Dashboard"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'analysis' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
                Analysis
            </button>
            <button
                onClick={() => onSetPage('methodology')}
                title="Methodology"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'methodology' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
                Methodology
            </button>
            <button
                onClick={() => onSetPage('about')}
                title="About"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'about' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
                About
            </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {page === 'map' && (
          <>
            <div className="space-y-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Lightbulb className="mr-2 text-yellow-400" size={20} />
                    Quick Tips
                </h2>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Click an airbase on the map or list to focus.</li>
                    <li>Click a school or hospital to see its distance from the nearest airbase.</li>
                    <li>Use the AI Chat for analysis and suggestions.</li>
                </ul>
            </div>
            {/* FIX: The AirbaseList component was not closed properly and was missing props. */}
            <AirbaseList 
              airbases={airbases} 
              onFlyTo={onFlyTo}
              selectedAirbase={selectedAirbase}
              onClearSelection={onClearAirbaseSelection}
            />
            
            {/* Overlay Layers Section */}
            <div>
              <button onClick={() => setIsOverlaysExpanded(!isOverlaysExpanded)} className="w-full flex justify-between items-center py-2">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Globe className="mr-2 text-blue-500" size={20} />
                  Overlay Layers
                </h2>
                {isOverlaysExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isOverlaysExpanded && (
                <div className="mt-2 space-y-2">
                  <OverlayLayerControl layer={satelliteLayer} onToggle={onToggleSatelliteLayer} onSetOpacity={onSetSatelliteLayerOpacity} />
                  <OverlayLayerControl layer={streetLayer} onToggle={onToggleStreetLayer} onSetOpacity={onSetStreetLayerOpacity} />
                  <OverlayLayerControl layer={waterNaturalLayer} onToggle={onToggleWaterNaturalLayer} onSetOpacity={onSetWaterNaturalLayerOpacity} />
                  <OverlayLayerControl layer={dynamicWorldLayer} onToggle={onToggleDynamicWorld} onSetOpacity={onSetDynamicWorldOpacity} />
                </div>
              )}
            </div>

            {/* Data Layers Section */}
            <div>
              <button onClick={() => setIsDataLayersExpanded(!isDataLayersExpanded)} className="w-full flex justify-between items-center py-2">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Layers className="mr-2 text-purple-500" size={20} />
                  Data Layers
                </h2>
                {isDataLayersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isDataLayersExpanded && (
                <div className="mt-2">
                  <LayerList layers={layers} onToggle={onToggleLayer} onRemove={onRemoveLayer} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* AI Chat Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full bg-emerald-600 text-white p-3 rounded-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          title="Open AI Chat"
        >
          <MessageSquarePlus size={20} />
          <span className="font-semibold">AI Chat Planner</span>
        </button>
      </div>

      {/* AI Chat Panel */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-white ${
          isChatOpen ? 'block' : 'hidden'
        }`}
      >
        <AiChat
          history={chatHistory}
          isLoading={isLoading}
          onQuery={onAiQuery}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </aside>
  );
};

// FIX: Added default export to resolve module import error.
export default Sidebar;

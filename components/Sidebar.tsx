

import React, { useState } from 'react';
import type { MapLayer, AiResponseMessage, AirbaseLocation } from '../types';
import AiChat from './AiChat';
import LayerList from './LayerList';
import AirbaseList from './AirbaseList';
import { Bot, MessageSquarePlus, Lightbulb } from 'lucide-react';

interface SidebarProps {
  page: 'map' | 'analysis' | 'methodology';
  onSetPage: (page: 'map' | 'analysis' | 'methodology') => void;
  airbases: AirbaseLocation[];
  layers: MapLayer[];
  chatHistory: AiResponseMessage[];
  isLoading: boolean;
  onAiQuery: (prompt: string) => void;
  onToggleLayer: (layerId: string) => void;
  onRemoveLayer: (layerId:string) => void;
  onFlyTo: (location: AirbaseLocation) => void;
  selectedAirbase: AirbaseLocation | null;
  onClearAirbaseSelection: () => void;
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
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <aside className="w-96 h-screen bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col shadow-2xl relative overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot size={28} className="text-cyan-400"/>
          <h1 className="text-xl font-bold text-gray-100 tracking-wider">Dhaka Air Base Planner</h1>
        </div>
      </div>
      
      {/* Page Navigation */}
      <div className="p-2 border-b border-gray-700">
        <div className="flex space-x-2">
            <button
                onClick={() => onSetPage('map')}
                title="Map View"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'map' ? 'bg-cyan-600 text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            >
                Map
            </button>
            <button
                onClick={() => onSetPage('analysis')}
                title="Analysis Dashboard"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'analysis' ? 'bg-cyan-600 text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            >
                Analysis
            </button>
            <button
                onClick={() => onSetPage('methodology')}
                title="About"
                className={`flex-1 text-center font-bold py-2 px-1 rounded-md transition-colors text-xs ${page === 'methodology' ? 'bg-cyan-600 text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            >
                About
            </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {page === 'map' && (
          <>
            <div className="space-y-4 bg-gray-900/40 p-3 rounded-lg border border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-300 flex items-center">
                    <Lightbulb className="mr-2 text-yellow-400" size={20} />
                    Quick Tips
                </h2>
                <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                    <li>Click an airbase on the map or list to focus.</li>
                    <li>Click a school or hospital to see its distance from the nearest airbase.</li>
                    <li>Use the AI Chat to add new data layers to the map.</li>
                </ul>
            </div>
            <AirbaseList 
              airbases={airbases} 
              onFlyTo={onFlyTo} 
              selectedAirbase={selectedAirbase} 
              onClearSelection={onClearAirbaseSelection}
            />
            <LayerList layers={layers.filter(l => !l.id.includes('airbase'))} onToggle={onToggleLayer} onRemove={onRemoveLayer} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full flex items-center justify-center space-x-2 bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors"
        >
          <MessageSquarePlus size={20} />
          <span>Open Planning AI Chat</span>
        </button>
      </div>

      {/* Collapsible Chat Panel */}
      <div
        className={`absolute bottom-0 left-0 w-full h-full bg-gray-800/70 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out ${
          isChatOpen ? 'translate-y-0' : 'translate-y-full'
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

export default Sidebar;
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plane, School, Hospital, Flame, MapPin } from 'lucide-react';

const MapLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-2xl text-gray-800 w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-2 font-bold text-gray-900 hover:bg-gray-100"
      >
        <span>Map Legend</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>
      {isOpen && (
        <div className="p-3 space-y-3">
            {/* Air Base */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="bg-white/80 p-1 rounded-full shadow-lg">
                        <Plane size={20} color="#047857" />
                    </div>
                </div>
                <span className="text-sm text-gray-700">Air Base</span>
            </div>

            {/* School */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow-md">
                        <School size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-700">School</span>
            </div>
            
            {/* Hospital */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-md">
                        <Hospital size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-700">Hospital</span>
            </div>

            {/* Fire Station */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="flex items-center justify-center w-6 h-6 bg-orange-600 rounded-full border-2 border-white shadow-md">
                        <Flame size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-700">Fire Station</span>
            </div>

             {/* Key Area */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="relative flex items-center justify-center">
                         <MapPin size={28} color="#0d9488" fill="#5eead4"/>
                    </div>
                </div>
                <span className="text-sm text-gray-700">Key Area</span>
            </div>

            {/* Uttara Sector */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <MapPin size={28} color="#059669" fill="#6ee7b7"/>
                        <span className="absolute text-white text-[10px] font-bold" style={{top: '5px'}}>#</span>
                    </div>
                </div>
                <span className="text-sm text-gray-700">Uttara Sector</span>
            </div>

            {/* Airbase Radius */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-orange-500/30" />
                </div>
                <span className="text-sm text-gray-700">Selected Airbase Radius (7km)</span>
            </div>

            {/* Traffic Heatmap */}
            <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-2 rounded-md bg-gradient-to-r from-pink-300 to-pink-700" />
                </div>
                <span className="text-sm text-gray-700">Traffic Congestion</span>
            </div>
             {/* Urban Heat Island */}
            <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-2 rounded-md bg-gradient-to-r from-blue-400 via-yellow-300 to-red-500" />
                </div>
                <span className="text-sm text-gray-700">Urban Heat Island</span>
            </div>

            {/* Air Particulates (AOD) */}
            <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-yellow-800/40 border-2 border-yellow-300" />
                </div>
                <span className="text-sm text-gray-700">Air Particulates (AOD)</span>
            </div>

            {/* Urban Greenness (NDVI) */}
            <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-lime-300 to-green-600" />
                </div>
                <span className="text-sm text-gray-700">Urban Greenness (NDVI)</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
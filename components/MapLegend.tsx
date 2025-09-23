import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plane, School, Hospital, Flame, MapPin } from 'lucide-react';

const MapLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl text-gray-200 w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-2 font-bold text-gray-100 hover:bg-gray-700/50"
      >
        <span>Map Legend</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>
      {isOpen && (
        <div className="p-3 space-y-3">
            {/* Air Base */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="bg-slate-800/80 p-1 rounded-full shadow-lg">
                        <Plane size={20} color="#f0f9ff" />
                    </div>
                </div>
                <span className="text-sm text-gray-300">Air Base</span>
            </div>

            {/* School */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md">
                        <School size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-300">School</span>
            </div>
            
            {/* Hospital */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-md">
                        <Hospital size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-300">Hospital</span>
            </div>

            {/* Fire Station */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="flex items-center justify-center w-6 h-6 bg-orange-600 rounded-full border-2 border-white shadow-md">
                        <Flame size={14} color="white" />
                    </div>
                </div>
                <span className="text-sm text-gray-300">Fire Station</span>
            </div>

             {/* Key Area */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                     <div className="relative flex items-center justify-center">
                         <MapPin size={28} color="#ec4899" fill="#fbcfe8"/>
                    </div>
                </div>
                <span className="text-sm text-gray-300">Key Area</span>
            </div>

            {/* Uttara Sector */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <MapPin size={28} color="#4f46e5" fill="#c7d2fe"/>
                        <span className="absolute text-white text-[10px] font-bold" style={{top: '5px'}}>#</span>
                    </div>
                </div>
                <span className="text-sm text-gray-300">Uttara Sector</span>
            </div>

            {/* Airbase Radius */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-orange-500/30" />
                </div>
                <span className="text-sm text-gray-300">Selected Airbase Radius (7km)</span>
            </div>

            {/* Traffic Heatmap */}
            <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-2 rounded-md bg-gradient-to-r from-pink-300 to-pink-700" />
                </div>
                <span className="text-sm text-gray-300">Traffic Congestion</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;

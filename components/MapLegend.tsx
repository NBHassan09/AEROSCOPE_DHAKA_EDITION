

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plane, School, Hospital, Flame, MapPin, Droplet, Trees } from 'lucide-react';

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
            
            {/* --- Divider --- */}
            <div className="border-t border-gray-300 pt-3 mt-3">
                <span className="font-semibold text-xs text-gray-600">Overlay Layers</span>
            </div>
            
            {/* Street Highlights */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-sm bg-gray-100 border-2 border-gray-300 relative overflow-hidden">
                        <div className="absolute top-1 right-0 w-full h-0.5 bg-gray-400"></div>
                        <div className="absolute top-3 left-0 w-full h-1 bg-amber-500"></div>
                        <div className="absolute bottom-1.5 left-0 w-full h-0.5 bg-gray-400"></div>
                    </div>
                </div>
                <span className="text-sm text-gray-700">Street Highlights</span>
            </div>

            {/* Water & Natural Spaces */}
           <div className="flex items-center space-x-3">
               <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                   <div className="w-6 h-6 rounded-sm border-2 border-gray-300 bg-[#c5e1c5] relative overflow-hidden">
                       <div className="absolute top-1/2 left-0 w-full h-1/2 bg-[#a3cbe1]"></div>
                   </div>
               </div>
               <span className="text-sm text-gray-700">Water & Natural Spaces</span>
           </div>

            {/* --- Sub-Divider --- */}
            <div className="border-t border-gray-200 pt-3 mt-2">
                <span className="font-semibold text-xs text-gray-600">Dynamic World Land Cover</span>
            </div>
            
            {/* Dynamic World Items */}
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#419bdf'}}></div><span className="text-sm text-gray-700">Water</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#397d49'}}></div><span className="text-sm text-gray-700">Trees</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#88b053'}}></div><span className="text-sm text-gray-700">Grass</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#7a87c6'}}></div><span className="text-sm text-gray-700">Flooded Vegetation</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#e49635'}}></div><span className="text-sm text-gray-700">Crops</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#dfc35a'}}></div><span className="text-sm text-gray-700">Shrub & Scrub</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#c4281b'}}></div><span className="text-sm text-gray-700">Built-up Area</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#a59b8f'}}></div><span className="text-sm text-gray-700">Bare Ground</span></div>
            <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-sm flex-shrink-0" style={{background: '#b39fe1'}}></div><span className="text-sm text-gray-700">Snow & Ice</span></div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
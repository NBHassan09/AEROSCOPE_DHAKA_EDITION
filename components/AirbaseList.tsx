


import React from 'react';
import type { AirbaseLocation } from '../types';
import { LocateFixed, XCircle } from 'lucide-react';

interface AirbaseListProps {
  airbases: AirbaseLocation[];
  onFlyTo: (location: AirbaseLocation) => void;
  selectedAirbase: AirbaseLocation | null;
  onClearSelection: () => void;
}

const AirbaseList: React.FC<AirbaseListProps> = ({ airbases, onFlyTo, selectedAirbase, onClearSelection }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <LocateFixed className="mr-2 text-emerald-500" size={20} />
            Air Bases
        </h2>
        {selectedAirbase && (
            <button
            onClick={onClearSelection}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            title="Clear selection"
            >
            <XCircle size={14} />
            <span>Clear</span>
            </button>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        {airbases.map((airbase) => (
          <button
            key={airbase.name}
            onClick={() => onFlyTo(airbase)}
            className={`w-full text-left p-2 rounded-md transition-all duration-200 text-gray-800 ${
              selectedAirbase?.name === airbase.name
                ? 'bg-emerald-600 font-bold text-white'
                : 'bg-gray-100 hover:bg-gray-200 hover:text-emerald-600'
            }`}
          >
            {airbase.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AirbaseList;
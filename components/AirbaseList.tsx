
import React from 'react';
import type { AirbaseLocation } from '../types';
import { LocateFixed } from 'lucide-react';

interface AirbaseListProps {
  airbases: AirbaseLocation[];
  onFlyTo: (location: AirbaseLocation) => void;
  selectedAirbase: AirbaseLocation | null;
}

const AirbaseList: React.FC<AirbaseListProps> = ({ airbases, onFlyTo, selectedAirbase }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-300 flex items-center">
        <LocateFixed className="mr-2 text-cyan-400" size={20} />
        Air Bases
      </h2>
      <div className="flex flex-col space-y-2">
        {airbases.map((airbase) => (
          <button
            key={airbase.name}
            onClick={() => onFlyTo(airbase)}
            className={`w-full text-left p-2 rounded-md transition-all duration-200 text-gray-200 ${
              selectedAirbase?.name === airbase.name
                ? 'bg-cyan-600 font-bold'
                : 'bg-gray-700/50 hover:bg-gray-700 hover:text-cyan-300'
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

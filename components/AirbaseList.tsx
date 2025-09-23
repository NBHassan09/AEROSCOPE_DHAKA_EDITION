

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
        <h2 className="text-lg font-semibold text-slate-300 flex items-center">
            <LocateFixed className="mr-2 text-cyan-400" size={20} />
            Air Bases
        </h2>
        {selectedAirbase && (
            <button
            onClick={onClearSelection}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
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
            className={`w-full text-left p-2 rounded-md transition-all duration-200 text-slate-200 ${
              selectedAirbase?.name === airbase.name
                ? 'bg-cyan-600 font-bold'
                : 'bg-slate-700/50 hover:bg-slate-700 hover:text-cyan-300'
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
import React from 'react';
import type { Feature } from 'geojson';
// FIX: The type 'AreaInfo' was not defined. Replaced with 'SectorInfo' which has the correct structure.
import type { SectorInfo } from '../types';
import { X, School, Hospital, Users } from 'lucide-react';

interface AreaInspectorProps {
  area: Feature;
  info: SectorInfo;
  onClose: () => void;
}

const AreaInspector: React.FC<AreaInspectorProps> = ({ area, info, onClose }) => {
  const { properties } = area;
  const { nearestSchool, nearestHospital } = info;

  const formatDistance = (distance: number | null) => {
    if (distance === null) return 'N/A';
    if (distance > 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl text-gray-200 z-[1000] animate-fade-in">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-cyan-400">{properties?.name || 'Area Details'}</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
          aria-label="Close inspector"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Users className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-400">Estimated Population</p>
            <p className="font-semibold text-lg">{properties?.population?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <School className="text-gray-400 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-gray-400">Nearest School</p>
            <p className="font-semibold">{nearestSchool.feature?.properties?.name || 'Not found'}</p>
            <p className="text-sm text-cyan-300">{formatDistance(nearestSchool.distance)} away</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Hospital className="text-gray-400 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-gray-400">Nearest Hospital</p>
            <p className="font-semibold">{nearestHospital.feature?.properties?.name || 'Not found'}</p>
            <p className="text-sm text-cyan-300">{formatDistance(nearestHospital.distance)} away</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaInspector;

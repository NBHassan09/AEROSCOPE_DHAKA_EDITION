import React from 'react';
import type { Feature } from 'geojson';
import type { SectorInfo } from '../types';
import { X, School, Hospital, Users } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface SectorInspectorProps {
  sector: Feature;
  info: SectorInfo;
  onClose: () => void;
}

const SectorInspector: React.FC<SectorInspectorProps> = ({ sector, info, onClose }) => {
  const { properties } = sector;
  const { nearestSchool, nearestHospital } = info;

  return (
    <div className="absolute top-4 right-4 w-80 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl text-slate-200 z-[1000] animate-fade-in">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-cyan-400">{properties?.name || 'Sector Details'}</h2>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded-full transition-colors"
          aria-label="Close inspector"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Users className="text-slate-400" size={20} />
          <div>
            <p className="text-sm text-slate-400">Estimated Population</p>
            <p className="font-semibold text-lg">{properties?.population?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <School className="text-slate-400 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-slate-400">Nearest School</p>
            <p className="font-semibold">{nearestSchool.feature?.properties?.name || 'Not found'}</p>
            <p className="text-sm text-cyan-300">{formatDistance(nearestSchool.distance)} away</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Hospital className="text-slate-400 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-slate-400">Nearest Hospital</p>
            <p className="font-semibold">{nearestHospital.feature?.properties?.name || 'Not found'}</p>
            <p className="text-sm text-cyan-300">{formatDistance(nearestHospital.distance)} away</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorInspector;
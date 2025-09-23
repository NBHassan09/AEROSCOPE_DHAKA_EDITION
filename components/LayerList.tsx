
import React from 'react';
import type { MapLayer } from '../types';
import { Layers, Eye, EyeOff, Trash2 } from 'lucide-react';

interface LayerListProps {
  layers: MapLayer[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const LayerList: React.FC<LayerListProps> = ({ layers, onToggle, onRemove }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-300 flex items-center">
        <Layers className="mr-2 text-cyan-400" size={20} />
        Layers
      </h2>
      {layers.length === 0 ? (
        <p className="text-gray-500 text-sm p-3 bg-gray-900/50 rounded-md">
          No layers yet. Use the chat below to generate geographic data.
        </p>
      ) : (
        <ul className="space-y-2">
          {layers.map((layer) => (
            <li
              key={layer.id}
              className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md transition-all duration-200 hover:bg-gray-700"
            >
              <span className="text-gray-200 truncate" title={layer.name}>{layer.name}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggle(layer.id)}
                  className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                  title={layer.isVisible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => onRemove(layer.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Layer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LayerList;

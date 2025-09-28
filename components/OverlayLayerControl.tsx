
import React from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import type { OverlayTileLayer } from '../types';

interface OverlayLayerControlProps {
  layer: OverlayTileLayer;
  onToggle: () => void;
  onSetOpacity: (opacity: number) => void;
}

const OverlayLayerControl: React.FC<OverlayLayerControlProps> = ({ layer, onToggle, onSetOpacity }) => {
  if (!layer.tileUrl) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-sm p-3 bg-gray-100/50 rounded-md">
        <Loader size={16} className="animate-spin" />
        <span>Loading {layer.name}...</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-2 rounded-md border border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-gray-800 truncate" title={layer.name}>{layer.name}</span>
            <div className="flex items-center">
                <button
                    onClick={onToggle}
                    className="p-1 text-gray-500 hover:text-emerald-500 transition-colors"
                    title={layer.isVisible ? 'Hide Layer' : 'Show Layer'}
                >
                    {layer.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
        </div>
        {layer.isVisible && (
            <div className="pt-2 border-t border-gray-100">
                <label htmlFor={`${layer.id}-opacity`} className="text-xs text-gray-600 flex justify-between mb-1">
                    <span>Opacity</span>
                    <span>{layer.opacity.toFixed(2)}</span>
                </label>
                <input
                    id={`${layer.id}-opacity`}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => onSetOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        )}
    </div>
  );
};

export default OverlayLayerControl;